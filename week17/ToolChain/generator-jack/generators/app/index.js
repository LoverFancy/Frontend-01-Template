var Generator = require("yeoman-generator");

module.exports = class extends Generator {
  // note: arguments and options should be defined in the constructor.
  constructor(args, opts) {
    super(args, opts);
  }

  async prompting() {
    this.dependency = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname, // Default to current folder name
      },
      {
        type: "input",
        name: "title",
        message: "your title",
      },
      {
        type: "input",
        name: "dependency",
        message: "your dependency library",
      },
    ]);
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath("index.html"),
      this.destinationPath("public/index.html"),
      { title: this.dependency.title }
    );
    const pkgJson = {
      devDependencies: {
        [this.dependency.dependency]: "*",
      },
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
  }
  install() {
    this.yarnInstall();
  }
};
