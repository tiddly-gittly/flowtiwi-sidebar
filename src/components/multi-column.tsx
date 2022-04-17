import React, { useCallback, useState } from 'react';
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
    setAllLayouts(newAllLayouts);
    debouncedOnChange(newAllLayouts);
  };
  return (
    <ResponsiveGridLayout
      className="layout"
      onLayoutChange={onLayoutChange}
      onBreakpointChange={(breakpoint, _newCols) => {
        setCurrentBreakpoint(breakpoint);
      }}
      layouts={allLayouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}>
      <div key="1">1</div>
      <div key="2">2</div>
      <div key="3">3</div>
    </ResponsiveGridLayout>
  );
}
