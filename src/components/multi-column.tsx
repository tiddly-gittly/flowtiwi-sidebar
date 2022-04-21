import React, { useMemo, useState } from 'react';
import { useFilter } from 'tw-react';
import { SizeMe } from 'react-sizeme';
import { Tiddler, Widget } from 'tiddlywiki';
import { Responsive } from 'react-grid-layout';
import { useDebouncedCallback } from 'beautiful-react-hooks';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { SideBarContent } from './content';
import { ParentWidgetContext } from './useRenderTiddler';


export interface IMultiColumnProps {
  layouts: ReactGridLayout.Layouts;
  onChange: (newLayouts: ReactGridLayout.Layouts) => any;
  defaultItemLayout?: Partial<ReactGridLayout.Layout>;
  parentWidget?: Widget;
}
export function MultiColumn(props: IMultiColumnProps): JSX.Element {
  const [currentBreakpoint, setCurrentBreakpoint] = useState('xxs');
  const [allLayouts, setAllLayouts] = useState(props.layouts);
  const debouncedOnChange = useDebouncedCallback(props.onChange, [], 1000);
  const onLayoutChange = (layout: ReactGridLayout.Layout[]) => {
    const newAllLayouts = { ...allLayouts, [currentBreakpoint]: layout };
    /** is first created layout, we will apply some default value to it */
    const isNewLayout = allLayouts[currentBreakpoint] === undefined;
    if (isNewLayout) {
      newAllLayouts[currentBreakpoint] = newAllLayouts[currentBreakpoint].map((item) => ({
        ...item,
        ...(props.defaultItemLayout ?? {}),
      }));
    }
    setAllLayouts(newAllLayouts);
    debouncedOnChange(newAllLayouts);
  };
  const sidebarTabTitles = useFilter('[all[shadows+tiddlers]tag[$:/tags/SideBar]!has[draft.of]]');
  const gridChildren = useMemo(
    () =>
      sidebarTabTitles.map((title) => {
        const tiddler = $tw.wiki.getTiddler<{ fields: { caption: string } } & Tiddler>(title);
        return (
          <div key={title}>
            <div className="flowtiwi-sidebar-tab-handle">{tiddler?.fields?.caption ?? title}</div>
            <SideBarContent title={title} />
          </div>
        );
      }),
    [sidebarTabTitles],
  );

  return (
    <ParentWidgetContext.Provider value={props.parentWidget}>
      <SizeMe>
        {({ size }) =>
          size.width ? (
            <Responsive
              draggableHandle=".flowtiwi-sidebar-tab-handle"
              width={size.width}
              className="layout tc-sidebar-tabs-main"
              onLayoutChange={onLayoutChange}
              onBreakpointChange={(breakpoint, _newCols) => {
                setCurrentBreakpoint(breakpoint);
              }}
              layouts={allLayouts}
              isBounded
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              margin={[0, 0]}
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
