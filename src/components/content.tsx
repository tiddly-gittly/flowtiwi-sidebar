import React, { createRef } from 'react';
import { useRenderTiddler } from 'tw-react';

export function SideBarContent(props: { title: string }): JSX.Element {
  const tabContentRef = createRef<HTMLDivElement>();
  useRenderTiddler(props.title, tabContentRef);
  return <div className="flowtiwi-sidebar-tab-content" ref={tabContentRef} />;
}
