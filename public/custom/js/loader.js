function toggleLoader() {
    if ($("#loader").css("display") === "none") {
      window.scrollTo(0, 0);
      $("#loader").css("display", "block");
      $("#icon").css("display", "block");
      $("#oops").css("display", "none");
      $("body").css("overflow", "hidden");
    } else {
      window.scrollTo(0, 0);
      $("#loader").css("display", "none");
      $("#icon").css("display", "block");
      $("#oops").css("display", "none");
      $("body").css("overflow", "visible");
    }
  }
  
  function setLoaderError(err) {
    $("#oops")
      .find("a")
      .attr("href", window.location.href);
    $("#oops")
      .find("#err")
      .html(err || "Someting went wrong and we couldn't process your request");
    window.scrollTo(0, 0);
    $("#icon").css("display", "none");
    $("#oops").css("display", "block");
  }
  