import type { IReactWidget } from 'tw-react';

const Widget = (require('$:/plugins/linonetwo/tw-react/widget.js') as { widget: IReactWidget }).widget;
import { IMultiColumnProps, MultiColumn } from './components/multi-column';

class LikeButtonWidget extends Widget<IMultiColumnProps> {
  reactComponent = MultiColumn;
  getProps = () => {
    const stateTiddler = this.getAttribute('stateTiddler', '$:/plugins/linonetwo/flowtiwi-sidebar/state');
    const layoutsRaw = $tw.wiki.getTiddlerText(stateTiddler) ?? '[]';
    let layouts: ReactGridLayout.Layouts = {};
    try {
      layouts = JSON.parse(layoutsRaw) as ReactGridLayout.Layouts;
    } catch (error) {
      console.error(
        `$:/plugins/linonetwo/flowtiwi-sidebar Error: JSON.parse(layoutsRaw) failed, layoutsRaw is ${layoutsRaw} ${(error as Error).message} ${
          (error as Error).stack
        }`,
      );
    }
    return { layouts };
  };
}
exports.likeButtonExampleWidget = LikeButtonWidget;
