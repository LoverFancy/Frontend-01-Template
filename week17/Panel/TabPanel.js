import {
  ToyReact
} from './pure';

const {
  Component
} = ToyReact;

export class TabPanel extends Component {

  constructor() {
    super();
    this.data = null;
    this.index = 0;
  }

  select(i) {
    this.children[this.index].element.parentElement.classList.remove(
      "selected"
    );
    this.index = i;
    this.children[this.index].element.parentElement.classList.add("selected");
  }

  render() {

    const children = this.children.map((i, index) => (
      <div class={`tabpanel-child ${this.index === index ? "selected" : ""}`}>{i}</div>
    ));

    const title = this.children.map((i, index) => {
      return (
        <div class="tabpanel-title" onClick={() => this.select(index)}>
          {i.props.title || ""}
        </div>
      );
    });


    const container = (
      <div class="tabpanel">
        <div class='title'>
          {title}
        </div>
        {children}
      </div>
    );

    return container;

  }
}