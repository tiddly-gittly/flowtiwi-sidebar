import React from 'react';
import { useFilter } from 'tw-react';
import { Responsive, WidthProvider } from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export interface IMultiColumnProps {
  layouts: ReactGridLayout.Layouts;
}
export function MultiColumn(props: IMultiColumnProps): JSX.Element {
  return (
    <ResponsiveGridLayout
      className="layout"
      onLayoutChange={(layouts) => {
        // DEBUG: console
        console.log(`layouts`, layouts);
      }}
      layouts={props.layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}>
      <div key="1">1</div>
      <div key="2">2</div>
      <div key="3">3</div>
    </ResponsiveGridLayout>
  );
}
