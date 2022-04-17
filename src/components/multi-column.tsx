import React, { useMemo, useState } from 'react';
import { useFilter } from 'tw-react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useDebouncedCallback } from 'beautiful-react-hooks';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export interface IMultiColumnProps {
  layouts: ReactGridLayout.Layouts;
  onChange: (newLayouts: ReactGridLayout.Layouts) => any;
}
export function MultiColumn(props: IMultiColumnProps): JSX.Element {
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');
  const [allLayouts, setAllLayouts] = useState(props.layouts);
  const debouncedOnChange = useDebouncedCallback(props.onChange, [], 1000);
  const onLayoutChange = (layout: ReactGridLayout.Layout[]) => {
    const newAllLayouts = { ...allLayouts, [currentBreakpoint]: layout };
    // DEBUG: console
    console.log(`newAllLayouts`, newAllLayouts);
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
  const gridChildren = sidebarTabContentHTMLs.map(({ key, __html }) => {
    return <div key={key}>
      <div className='flowtiwi-sidebar-content' dangerouslySetInnerHTML={{ __html }} />
    </div>;
  });
  return (
    <ResponsiveGridLayout
      className="layout tc-sidebar-tabs-main"
      onLayoutChange={onLayoutChange}
      onBreakpointChange={(breakpoint, _newCols) => {
        setCurrentBreakpoint(breakpoint);
      }}
      layouts={allLayouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}>
      {gridChildren}
    </ResponsiveGridLayout>
  );
}
