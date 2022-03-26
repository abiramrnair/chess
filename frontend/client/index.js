// Babel has deprecated @babel/polyfill, and the following two imports are used for polyfills instead.
import "core-js/stable";
import "regenerator-runtime/runtime";
import m from "mithril";
import App from "./app";
import "./styles/index.scss";

m.mount(document.body, App);
