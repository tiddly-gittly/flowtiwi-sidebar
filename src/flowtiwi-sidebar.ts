import { IChangedTiddlers } from 'tiddlywiki';
import type { IReactWidget } from 'tw-react';
import debounce from 'lodash/debounce';

import { IMultiColumnProps, MultiColumn } from './components/multi-column';
import './style.css';
import { DEBOUNCE_UPDATE_INTERVAL } from './config';

const Widget = (require('$:/plugins/linonetwo/tw-react/widget.js') as { widget: IReactWidget }).widget;

class FlowTiWiWidget extends Widget<IMultiColumnProps> {
  constructor(parseTreeNode: any, options: any) {
    super(parseTreeNode, options);
    const debouncedRefresh = debounce(this.refresh.bind(this), DEBOUNCE_UPDATE_INTERVAL * 1.5);
    this.refresh = (changedTiddlers: IChangedTiddlers) => {
      debouncedRefresh(changedTiddlers);
      return true;
    };
  }

  refresh(changedTiddlers: IChangedTiddlers) {
    const sidebarClosed = $tw.wiki.getTiddlerText('$:/state/sidebar') === 'no';
    if (sidebarClosed) {
      return false;
    }
    return this.refreshChildren(changedTiddlers);
  }

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
