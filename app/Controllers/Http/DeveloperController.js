class DeveloperController {
    async landing({view}) {
        return view.render("displays.developer.landing");
    }
}


module.exports = DeveloperController;