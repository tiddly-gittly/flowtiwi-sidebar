# Typescript plugin template for TiddlyWiki5

Enhanced multi-column sidebar gives you Flow in TiddlyWiki. 强大的多栏侧边栏让你在太微里享受心流。

## Design 设计思路

知识充满上下文，但人脑的工作记忆有限，因此在通过人机交互录入和提取知识时，为了让这个赛博协同系统维持高效，我们需要机器提供动态化侧边栏这样的界面展示实时上下文，辅助系统的人类部分低成本获取上下文。不同的工作类型需要不同种类、数量的上下文，所以侧边栏需要能通过人类交互、自动化接口实时对各上下文的展示区域大小、内容范围进行调整，来让工作尽可能不受到工作记忆的限制。

Knowledge is full of context, but the human brain has a limited working memory, so in order to keep this Cybersyn efficient when I/O knowledge through human-computer interface, we need the machine to provide an interface such as a dynamic sidebar to display real-time context to assist the human part of the system in obtaining context at low cost. Different types of work require different types and amounts of context, so the sidebar needs to be able to adjust the size of the display area and the content of area in real time through human interaction and automation API, to make the work unconstrained from the working memory.

Translated with www.DeepL.com/Translator (free version)

## Usage

## Development

There are some scripts you can run to boost your development.

After `npm i --legacy-peer-deps`:

- `npm run dev-demo` to setup the demo site locally. Re-run this command and refresh browser to see changes to local code and tiddlers.
- `npm run dev` to pack the plugin in the `dist/` directory.

You will need `--legacy-peer-deps` when `npm i` if you are using latest nodejs. This is a bug in npm.
