/** This is not used anymore, logic is now built into React component - can be deleted - by Lung
 * Equal height - by Lewi Hussey
 */

const matchHeight = (function() {
  let initialized = false;
  const untilFound = intervalTrigger();

  function init() {
    eventListeners();
    // console.log("init, document ready");
    setInterval(() => {
      if (initialized) {
        window.clearInterval(untilFound);
      }
    }, 1000);
  }

  function intervalTrigger() {
    return window.setInterval(function() {
      matchHeight();
    }, 1000);
  }

  function eventListeners() {
    $(window).on("resize", function() {
      matchHeight();
    });
  }

  function matchHeight() {
    $(document).ready(function() {
      // console.log('matchHeight called');
      const groupName = $(".card");
      if (groupName.length > 0) {
        initialized = true;
      }
      // console.log('cards', groupName);
      const groupHeights = [];

      groupName.css("min-height", "auto");

      groupName.each(function() {
        groupHeights.push($(this).outerHeight());
        // console.log("each height:", $(this).outerHeight());
      });

      const maxHeight = Math.max.apply(null, groupHeights);
      groupName.css("min-height", maxHeight);
    });
  }

  return {
    init,
  };
})();

$(document).ready(function() {
  matchHeight.init();
  // TODO: fix on load height match
});
