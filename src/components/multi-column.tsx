import React, { useMemo, useState, forwardRef } from 'react';
import { useFilter } from 'tw-react';
import { SizeMe } from 'react-sizeme';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useDebouncedCallback } from 'beautiful-react-hooks';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export interface IMultiColumnProps {
  layouts: ReactGridLayout.Layouts;
  onChange: (newLayouts: ReactGridLayout.Layouts) => any;
  defaultItemLayout?: Partial<ReactGridLayout.Layout>;
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
  const sidebarTabContentHTMLs = useMemo(() => {
    return sidebarTabTitles.map((title) => {
      const contentHTML = $tw.wiki.renderTiddler('text/html', title);
      return { key: title, __html: contentHTML };
    });
  }, [sidebarTabTitles]);
  const gridChildren = useMemo(
    () =>
      sidebarTabContentHTMLs.map(({ key, __html }) => {
        return (
          <div key={key}>
            <div className="flowtiwi-sidebar-tab-handle">{key}</div>
            <div className="flowtiwi-sidebar-tab-content" dangerouslySetInnerHTML={{ __html }} />
          </div>
        );
      }),
    [sidebarTabTitles],
  );
  return (
    <SizeMe>
      {({ size }) =>
        size.width ? (
          <Responsive
            draggableHandle="flowtiwi-sidebar-tab-handle"
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
  );
}
