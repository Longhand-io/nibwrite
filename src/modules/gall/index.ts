// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 0xSpectra LLC and the Oakfall Authors.

// Gall, the assistant. Off by default. This module is the panel and the answers that need no
// model; it talks to nothing outside the vault. The hosted Gall plugs in behind the same panel.

import type { Core, Module } from "../../core/modules.js";
import { GallSession } from "./session.js";
import { mountGallDock, mountGallView, GALL_VIEW_TYPE } from "./view.js";

export const GALL_VIEW = GALL_VIEW_TYPE;

let registeredHost: Core["host"] | null = null;

export const gallModule: Module = {
  id: "gall",
  name: "Gall",
  description: "The assistant in the margin. Answers where someone was last seen, what is set at a place, who is in a scene, and more, from your files alone. Off by default; no network.",
  defaultEnabled: false,

  register(core: Core) {
    const host = core.host;
    registeredHost = host;
    const session = new GallSession();
    host.registerView(GALL_VIEW, {
      icon: "pen-tool",
      placement: "right",
      title: () => "Gall",
      mount: (el, state) => mountGallView(core, el, session, state.path),
    });
    host.registerCommand({ id: "gall-ask", name: "Ask Gall", run: () => host.openView(GALL_VIEW, { path: "" }) });
    host.registerRibbon("pen-tool", "Ask Gall", () => host.openView(GALL_VIEW, { path: "" }));
    // the character in the corner of the window, following whatever note is active
    host.registerOverlay({ id: "gall", mount: (el) => mountGallDock(core, el, session, host.activeFile() ?? "", true) });
  },

  unregister() {
    // the host keeps the view and command registered; the corner nib goes away
    registeredHost?.unregisterOverlay("gall");
  },
};
