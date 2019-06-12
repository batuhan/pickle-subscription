/**
 * @author Batch Themes Ltd.
 */
(function() {
  $(function() {
    if (!element_exists("#icons-flags")) {
      return false;
    }
    let icons = [];
    $(".flag-icons .icon").each(function() {
      icons.push($(this).data("icon"));
    });
    icons = _.uniq(icons);
    $("#search-icons").on("keyup", function() {
      const val = $(this).val();
      const results = icons.filter(function(value) {
        const regex = new RegExp(val, "gi");
        return value.match(regex);
      });
      $(".flag-icons .icon").each(function() {
        const icon = $(this).data("icon");
        if (results.indexOf(icon) == -1) {
          $(this).addClass("hidden");
        } else {
          $(this).removeClass("hidden");
        }
      });
    });
  });
})();
