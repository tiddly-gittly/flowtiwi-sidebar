import { RefObject, useEffect } from 'react';

export function useRenderTiddler(tiddlerTitle: string, containerRef: RefObject<HTMLDivElement>) {
  useEffect(() => {
    if (containerRef.current === null) {
      return;
    }
    const transcludeWidgetNode = $tw.wiki.makeTranscludeWidget(tiddlerTitle, { document, parentWidget: $tw.rootWidget, recursionMarker: 'no' });
    const tiddlerContainer = document.createElement('div');
    containerRef.current.append(tiddlerContainer);
    transcludeWidgetNode.render(tiddlerContainer, null);
    $tw.hooks.invokeHook("th-page-refreshed");
  }, [tiddlerTitle, containerRef.current]);
}
