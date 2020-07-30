import {
  ToyReact
} from './pure';

const {
  Component
} = ToyReact;

export class ListView extends Component {

  constructor() {
    super();
    this.data = null;
  }


  render() {

    const container = (
      <div>{this.props.data.map((i) => this.children[0](i))}</div>
    );

    return container;

  }
}
