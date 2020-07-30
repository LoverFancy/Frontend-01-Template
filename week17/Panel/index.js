import { ToyReactDOM } from './pure';
import {
  TabPanel
} from './TabPanel';
import {
  ListView
} from './ListView';
// @ts-ignore
import css from './carousel.css';

const panel = (
  <TabPanel>
    <span title="this is my panel1">this is content1</span>
    <span title="this is my panel2">this is content2</span>
    <span title="this is my panel3">this is content3</span>
  </TabPanel>
);

console.log(css);

const listView = (
  <ListView
    data={[
      {
        title: "cat1",
        url:
          "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
      },
      {
        title: "cat2",
        url:
          "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
      },
      {
        title: "cat3",
        url:
          "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
      },
      {
        title: "cat4",
        url:
          "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
      },
    ]}
  >
    {(record) => (
      <figure>
        <img src={record.url} alt="Elephant at sunset" />
        <figcaption> {record.title} </figcaption>
      </figure>
    )}
  </ListView>
);

ToyReactDOM.render(
  <div>
  {
    listView
  }
  {
    panel
  }
  </div>
  , document.body);
