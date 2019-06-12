const express = require("express");
const Entity = require("../models/base/entity");
const EntityRoutes = require("../api/entity");

class ResourceDefinition {
  constructor(modelConfig, routeConfig, database) {
    const newRouter = express.Router();
    const { tableName, references, primaryKey } = modelConfig;
    const { resourceName, userCorrelator } = routeConfig;
    this.model = Entity(
      tableName,
      references || [],
      primaryKey || "id",
      database,
    );
    this.routes = EntityRoutes(
      newRouter,
      this.model,
      resourceName,
      userCorrelator,
    );
    this.name = resourceName;
    this.database = database;
    this.tableName = tableName;
    this.primaryKey = primaryKey;
    this.userCorrelator = userCorrelator;
  }

  async isOwner(resourceId, userId) {
    if (this.userCorrelator === undefined) {
      throw `${this.name} cannot have an owner`;
    }
    return await this.database(this.tableName)
      .where(this.userCorrelator, userId)
      .andWhere(this.primaryKey, resourceId);
  }
}

module.exports = ResourceDefinition;
