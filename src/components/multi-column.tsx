import React, { useCallback, useMemo, useState } from 'react';
import { useFilter } from 'tw-react';
import { SizeMe } from 'react-sizeme';
import { Tiddler, Widget } from 'tiddlywiki';
import { Responsive } from 'react-grid-layout';
import { useDebouncedCallback } from 'beautiful-react-hooks';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { SideBarContent } from './content';
import { ParentWidgetContext } from 'tw-react';
import { DEBOUNCE_UPDATE_INTERVAL } from 'src/config';

const defaultBreakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const defaultCols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
const defaultMargin = [0, 0] as [number, number];

export interface IMultiColumnProps {
  layouts: ReactGridLayout.Layouts;
  onChange: (newLayouts: ReactGridLayout.Layouts) => any;
  defaultItemLayout?: Partial<ReactGridLayout.Layout>;
  parentWidget?: Widget;
}
export function MultiColumn(props: IMultiColumnProps): JSX.Element {
  const [allLayouts, setAllLayouts] = useState(props.layouts);
  const debouncedOnChange = useDebouncedCallback(props.onChange, [], 1000);
  const onLayoutChange = (layout: ReactGridLayout.Layout[], newAllLayouts: ReactGridLayout.Layouts) => {
    setAllLayouts(newAllLayouts);
    debouncedOnChange(newAllLayouts);
  };
  const onClick = useCallback(
    (event: React.MouseEvent, to: string) => {
      if (!props.parentWidget) return;
      // const domNode = attributes.ref.current as HTMLLinkElement | undefined;
      // if (!domNode) return;
      event.preventDefault();
      event.stopPropagation();
      // const bounds = domNode.getBoundingClientRect();
      const twNavigateEvent = {
        type: 'tm-navigate',
        navigateTo: to,
        navigateFromTitle: props.parentWidget.getVariable('storyTiddler'),
        navigateFromNode: props.parentWidget,
        // navigateFromClientRect: {
        //   top: bounds.top,
        //   left: bounds.left,
        //   width: bounds.width,
        //   right: bounds.right,
        //   bottom: bounds.bottom,
        //   height: bounds.height,
        // },
        // navigateFromClientTop: bounds.top,
        // navigateFromClientLeft: bounds.left,
        // navigateFromClientWidth: bounds.width,
        // navigateFromClientRight: bounds.right,
        // navigateFromClientBottom: bounds.bottom,
        // navigateFromClientHeight: bounds.height,
        navigateSuppressNavigation: event.metaKey || event.ctrlKey || event.button === 1,
        metaKey: event.metaKey,
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        shiftKey: event.shiftKey,
        event: event.nativeEvent,
      };
      props.parentWidget.dispatchEvent(twNavigateEvent);
    },
    [props.parentWidget],
  );
  const sidebarTabTitles = useFilter('[all[shadows+tiddlers]tag[$:/tags/SideBar]!has[draft.of]]');
  const gridChildren = useMemo(
    () =>
      sidebarTabTitles.map((title) => {
        const tiddler = $tw.wiki.getTiddler<{ fields: { caption: string } } & Tiddler>(title);
        const renderedCaption = $tw.wiki.renderText('text/plain', 'text/vnd.tiddlywiki', tiddler?.fields?.caption ?? title, {
          parseAsInline: true,
          parentWidget: props.parentWidget,
        });
        return (
          <div key={title}>
            <div className="flowtiwi-sidebar-tab-handle" >
              <span className="flowtiwi-sidebar-tab-handle-title" onClick={(event) => onClick(event, title)}>{renderedCaption}</span>
            </div>
            <SideBarContent title={title} />
          </div>
        );
      }),
    [sidebarTabTitles, onClick],
  );

  return (
    <ParentWidgetContext.Provider value={props.parentWidget}>
      <SizeMe refreshRate={DEBOUNCE_UPDATE_INTERVAL / 2}>
        {({ size }) =>
          size.width ? (
            <Responsive
              draggableHandle=".flowtiwi-sidebar-tab-handle"
              width={Math.floor(size.width)}
              className="layout tc-sidebar-tabs-main"
              onLayoutChange={onLayoutChange}
              layouts={allLayouts}
              isBounded
              breakpoints={defaultBreakpoints}
              cols={defaultCols}
              margin={defaultMargin}
              autoSize>
              {gridChildren}
            </Responsive>
          ) : (
            <div />
          )
        }
      </SizeMe>
    </ParentWidgetContext.Provider>
  );
}
