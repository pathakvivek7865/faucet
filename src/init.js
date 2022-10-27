import process from "process";
import EventEmitter from "events";
import { Buffer } from "buffer";

window.Buffer = Buffer;
window.process = process;
window.EventEmitter = EventEmitter;