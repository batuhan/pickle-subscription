module.exports = function(database, initConfig) {
  // todo: move dependencies into plugins
  // todo: should not depend on code from another plugin directly...
  const options = require("../system-options/default-options");
  const systemOptions = options.options;
  const SystemOption = require("../../models/system-options");
  const ServiceCategory = require("../../models/service-category");
  const Permission = require("../../models/permission");
  const NotificationTemplate = require("../../models/notification-template");
  const User = require("../../models/user");
  const Role = require("../../models/role");
  const DefaultTemplates = require("../../config/default-notifications");

  const assignPermissionPromise = function(
    initConfig,
    permission_objects,
    initialRoleMap,
  ) {
    return function(role) {
      return new Promise(function(resolve, reject) {
        const mapped = initialRoleMap[role.get("role_name")];
        const perms_to_assign = permission_objects.filter(p =>
          mapped.includes(p.get("permission_name")),
        );
        role.assignPermission(perms_to_assign, function(result) {
          resolve(role);
        });
      });
    };
  };

  const createAdmin = initConfig => {
    return new Promise((resolve, reject) => {
      if (initConfig && initConfig.admin_user && initConfig.admin_password) {
        // sets the stripe keys so the createWithStripe function has access to store data that needs to exist...
        const stripeOptions = {
          stripe_secret_key: initConfig.stripe_secret,
          stripe_publishable_key: initConfig.stripe_public,
        };
        Role.findOne("role_name", "admin", adminRole => {
          const admin = new User({
            email: initConfig.admin_user,
            password: require("bcryptjs").hashSync(
              initConfig.admin_password,
              10,
            ),
            role_id: adminRole.get("id"),
            name: initConfig.admin_name || "admin",
          });
          if (initConfig.stripe_public && initConfig.stripe_secret) {
            admin.createWithStripe(stripeOptions, function(err, result) {
              if (err) {
                console.error(err);
                reject(err);
              }
              resolve(result);
            });
          } else {
            console.log("NO KEYS PROVIDED");
            admin.create((err, result) => {
              if (err) {
                console.error(err);
                reject(err);
              }
              resolve(result);
            });
          }
        });
      } else {
        reject("no admin defined, can't initialize...");
      }
    });
  };

  return new Promise(function(resolve, reject) {
    const initialRoleMap = require("./initial-role-map.json");

    // todo: can we just take admin since it probably has all the permissions?
    const permissions = [
      ...new Set([
        ...initialRoleMap.admin,
        ...initialRoleMap.user,
        ...initialRoleMap.staff,
      ]),
    ];
    const roles = Object.keys(initialRoleMap);
    const permission_data = permissions.map(permission => ({
      permission_name: permission,
    }));
    const role_data = roles.map(role => ({ role_name: role }));

    if (initConfig.stripe_public && initConfig.stripe_secret) {
      systemOptions.push(
        {
          option: "stripe_secret_key",
          value: initConfig.stripe_secret,
          type: "payment",
          public: false,
        },
        {
          option: "stripe_publishable_key",
          value: initConfig.stripe_public,
          type: "payment",
          public: false,
        },
      );
    }

    const defaultCategory = new ServiceCategory({
      name: "Uncategorized",
      description: "Uncategorized Services",
    });
    defaultCategory.create(newCategory => {
      console.log("Default Category created");
    });

    // create default email templates
    NotificationTemplate.batchCreate(DefaultTemplates.templates, function(
      emailResult,
    ) {
      // create roles
      Role.batchCreate(role_data, function(roles) {
        // get the User role id for default_user_role
        const userRole = roles.filter(role => role.role_name == "user")[0];
        systemOptions.push({
          option: "default_user_role",
          public: true,
          type: "system",
          data_type: "user_role",
          value: userRole.id,
        });

        // create options
        SystemOption.batchCreate(systemOptions, function(optionResult) {
          const EmailTemplateToRoles = require("../../models/base/entity")(
            "notification_templates_to_roles",
            [],
            "id",
            database,
          );
          EmailTemplateToRoles.batchCreate(
            DefaultTemplates.templates_to_roles,
            function(emailToRolesResult) {},
          );

          // create role objects from results of inserts
          const role_objects = roles.map(role => new Role(role));

          // create permissions
          Permission.batchCreate(permission_data, function(result) {
            // create permission objects from results of inserts
            const permission_objects = result.map(
              permission => new Permission(permission),
            );

            // assign permissions to roles
            resolve(
              Promise.all(
                role_objects.map(
                  assignPermissionPromise(
                    initConfig,
                    permission_objects,
                    initialRoleMap,
                  ),
                ),
              )
                .then(function() {
                  // Assign all system settings
                  return new Promise(function(resolve, reject) {
                    const options = [
                      {
                        option: "company_name",
                        value: initConfig.company_name,
                      },
                      {
                        option: "company_address",
                        value: initConfig.company_address,
                      },
                      {
                        option: "company_phone_number",
                        value: initConfig.company_phone_number,
                      },
                      {
                        option: "company_email",
                        value: initConfig.company_email,
                      },
                      { option: "hostname", value: initConfig.hostname },
                    ];
                    SystemOption.batchUpdate(options, function(result) {
                      return resolve(result);
                    });
                  });
                })
                .then(options => {
                  return createAdmin(initConfig);
                }),
            );
          });
        });
      });
    });
  });
};
