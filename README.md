# prompts-converter

Converts [**f/awesome-chatgpt-prompts**](https://github.com/f/awesome-chatgpt-prompts) to be compatible with various AI platforms and/or agents.

This script fetches the prompts data from the [**`f/awesome-chatgpt-prompts`**](https://github.com/f/awesome-chatgpt-prompts) repo and processes them to be compatible with different agent formats. The conversion includes parsing the original prompt structure, transforming the data to meet the requirements of the target format, and outputting the converted prompts in the appropriate agent format.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run convert.js --target [TARGET] --output [FILE]
```

> [!NOTE]
> **Supported targets**: Currently, the supported target is `open-webui`. Support for additional formats will be added in the future. Contributions are welcome!

> [!WARNING]
> **Known bugs**: When converting prompts for the `open-webui` target, you might notice some commands being duplicated, which can cause some prompts to fail to import.

---

This project was created using `bun init` in bun v1.2.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

Licensed under the MIT license. See [LICENSE](/LICENSE).