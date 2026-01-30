<div align="center">

  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./docs/images/logo-dark.svg">
    <img src="./docs/images/logo-light.svg" alt="Lunettes Logo" width="256">
  </picture>
	<h1><b><i>L</i>un</b>ettes</h1>

  <p>A userscript that intelligently modifies web fonts using CSS injection to achieve Bionic Reading.</p>

  [![Install](https://img.shields.io/badge/Install-Greasy%20Fork-orange?style=for-the-badge&logo=greasyfork&logoColor=white)](https://greasyfork.org/zh-CN/scripts/564575-lunettes)

  [![Stars](https://img.shields.io/github/stars/2005czq/lunettes?style=flat-square)](https://github.com/2005czq/lunettes/stargazers) [![Downloads](https://img.shields.io/greasyfork/dt/564575?style=flat-square)](https://greasyfork.org/zh-CN/scripts/564575-lunettes) [![Version](https://img.shields.io/github/v/release/2005czq/lunettes?style=flat-square)](https://github.com/2005czq/lunettes/releases) [![Last Commit](https://img.shields.io/github/last-commit/2005czq/lunettes?style=flat-square)](https://github.com/2005czq/lunettes/commits/main)

  ![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=flat-square&logo=svelte&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat-square&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat-square&logo=vite&logoColor=white)

  **English** | [简体中文](./README.zh-CN.md)

</div>

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation & Configuration](#installation--configuration)
- [Development](#development)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)

## Introduction

***L*un**ettes is a userscript that brings Bionic Reading effects to web pages. Inspired by [Fast-Font](https://github.com/Born2Root/Fast-Font), it utilizes CSS to inject custom fonts that leverage OpenType features. It achieves the visual effect of Bionic Reading without modifying any text nodes in the HTML.

> [!note]
>
> Bionic Reading is a method that guides the eyes through text via artificial fixation points. By highlighting the initial letters of words, it allows the brain to focus on these points and automatically complete the rest of the word, thereby improving reading speed and comprehension.

<div align="center">
  <img src="./docs/images/preview.png" alt="Preview" width="512">
</div>

<p align="center">Article Source: <a href="https://www.theatlantic.com/ideas/2026/01/war-empathy-hillary-clinton/685809/">The Atlantic</a></p>

## Features

- Applies effects using CSS `@font-face` and `font-feature-settings`, ensuring high-performance rendering and compatibility with modern Web frameworks.
- Caches font data locally to reduce network requests.
- Highly customizable, allowing configuration of "bionized" fonts and website filtering.

## Installation & Configuration

1. Install a user script manager, such as [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).
2. Install this script from [Greasy Fork](https://greasyfork.org/en/scripts/564575-lunettes) or [GitHub Releases](https://github.com/2005czq/lunettes/releases).

After installation, a glasses floating button will appear in the bottom right corner of the page. Click it to open the settings page.

<div align="center">
  <img src="./docs/images/settings.png" alt="Settings Page" width="512">
</div>

- **Language**: Currently supports English and 简体中文.
- **Theme**: Supports Light, Follow System (Default), and Dark themes.
- **Font Matching Settings**: Specify which fonts on the page should be replaced with bionic fonts.
	- **Sans-serif to Replace**: Add font names, such as `Google Sans` or `Segoe UI`.
	- **Serif to Replace**: Same as above, add font names.
- **Filtered Websites**: Precisely control where ***L*un**ettes takes effect to avoid conflicts or optimize reading experiences for specific scenarios. Supports wildcards (e.g., `*://*.google.com/*`).
	- **Blacklist Mode** (Default): The script will run on all websites **except** those in the list.
	- **Whitelist Mode**: The script will run **only** on websites in the list.

Additionally, the Tampermonkey menu provides options to toggle the floating button display and a factory reset button.

## Development

```bash
git clone https://github.com/2005czq/lunettes.git # Clone the repository
pnpm install # Install dependencies
pnpm run dev # Start the development server
pnpm run build # Build the project
```

## Project Structure

```
.
├── LICENSE                              # License
├── README.md                            # English docs
├── README.zh-CN.md                      # Simplified Chinese docs
├── docs
│   └── images                           # README images
│       ├── logo-dark.svg
│       ├── logo-light.svg
│       ├── preview.png
│       ├── settings.png
│       └── settings.zh-CN.png
├── package.json
├── pnpm-lock.yaml
├── public
│   └── fonts                            # Runtime font assets
│       ├── Inter-Bionic.woff2           # Sans bionic font
│       └── SourceSerif4-Bionic.woff2    # Serif bionic font
├── src
│   ├── entry
│   │   └── userscript.ts                # Userscript entry
│   ├── app
│   │   ├── App.svelte                   # App root
│   │   ├── components
│   │   │   ├── Dropdown.svelte          # Dropdown select
│   │   │   ├── EditableList.svelte      # Editable list input
│   │   │   ├── FloatingButton.svelte    # Floating settings button
│   │   │   ├── Modal.svelte             # Modal container
│   │   │   ├── ToggleGroup.svelte       # Segmented toggle
│   │   │   └── index.ts                 # Component exports
│   │   ├── pages
│   │   │   └── SettingsPage.svelte      # Settings UI + settings sync
│   │   └── styles
│   │       └── theme.css                # Theme tokens + base styles
│   ├── core
│   │   ├── bionic
│   │   │   ├── css.ts                   # Build injected font CSS
│   │   │   ├── filters.ts               # URL whitelist/blacklist match
│   │   │   ├── fonts.ts                 # Load/cache font sources
│   │   │   ├── index.ts                 # Apply/remove injected styles
│   │   │   └── style.ts                 # Inject CSS into page
│   │   ├── i18n
│   │   │   └── index.ts                 # Locale store + strings
│   │   ├── settings
│   │   │   └── index.ts                 # Settings store + menu items
│   │   └── storage.ts                   # GM/localStorage helpers
│   └── vite-env.d.ts
├── svelte.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Roadmap

- [ ] Provide a control to freely pick fonts from web page elements to enhance user experience and customization.
- [ ] Utilize [Fontsource API](https://fontsource.org/docs/api/introduction) or [Google Fonts API](https://developers.google.com/fonts/docs/developer_api) to automatically identify the classification of page fonts and intelligently apply the corresponding bionic font variants.

## Contributing

We welcome pull requests! You can contribute by:

- Adding support for more languages (i18n)
- Improving the user interface
- Fixing bugs
- Adding new features

For i18n contributions, please:
- Add translations to the `src/core/i18n/` directory
- Provide a screenshot of the translated setting page (create a new `docs/images/settings.<lang>.png` file)
- Translate the README (create a new `README.<lang>.md` file)

## Credits

- [Fast-Font](https://github.com/Born2Root/Fast-Font)
- [Inter](https://fonts.google.com/specimen/Inter): The base font for the sans-serif bionic font in this project.
- [Source Serif 4](https://fonts.google.com/specimen/Source+Serif+4): The base font for the serif bionic font in this project.
- [Font Awesome](https://fontawesome.com/): Icons used in the userscript (licensed under CC BY 4.0).

## License

This project is licensed under the [MIT License](LICENSE).
