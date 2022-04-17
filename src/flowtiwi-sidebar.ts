import type { IReactWidget } from 'tw-react';

import { IMultiColumnProps, MultiColumn } from './components/multi-column';

const Widget = (require('$:/plugins/linonetwo/tw-react/widget.js') as { widget: IReactWidget }).widget;

class FlowTiWiWidget extends Widget<IMultiColumnProps> {
  reactComponent = MultiColumn;
  getProps = () => {
    const stateTiddler = this.getAttribute('stateTiddler', '$:/plugins/linonetwo/flowtiwi-sidebar/state');
    const layouts: ReactGridLayout.Layouts = $tw.wiki.getTiddlerData(stateTiddler, {});
    const onChange = (newLayouts: ReactGridLayout.Layouts) => {
      $tw.wiki.setTiddlerData(stateTiddler, newLayouts);
    };
    return { layouts, onChange, defaultItemLayout: { w: 2 } };
  };
}

exports.flowTiWi = FlowTiWiWidget;
