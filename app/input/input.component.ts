import { Component, NgZone, OnInit, ViewContainerRef } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { AbstractMenuPageComponent } from "../abstract-menu-page-component";
import { MenuComponent } from "../menu/menu.component";
import { ModalDialogService } from "nativescript-angular";
import { PluginInfo } from "../shared/plugin-info";
import { PluginInfoWrapper } from "../shared/plugin-info-wrapper";
import { SegmentedBarItem } from "tns-core-modules/ui/segmented-bar";
import { PropertyChangeData } from "tns-core-modules/data/observable";
import { DrawingPad } from "nativescript-drawingpad";
import { IQKeyboardHelper } from "./helpers/iqkeyboard-helper";

@Component({
  selector: "Input",
  moduleId: module.id,
  templateUrl: "./input.component.html",
  styleUrls: ["input-common.css"],
  animations: [
    trigger("from-bottom", [
      state("in", style({
        "opacity": 1,
        transform: "translateY(0)"
      })),
      state("void", style({
        "opacity": 0,
        transform: "translateY(20%)"
      })),
      transition("void => *", [animate("1600ms 700ms ease-out")]),
      transition("* => void", [animate("600ms ease-in")])
    ]),
    trigger("fade-in", [
      state("in", style({
        "opacity": 1
      })),
      state("void", style({
        "opacity": 0
      })),
      transition("void => *", [animate("800ms 2000ms ease-out")])
    ]),
    trigger("scale-in", [
      state("in", style({
        "opacity": 1,
        transform: "scale(1)"
      })),
      state("void", style({
        "opacity": 0,
        transform: "scale(0.9)"
      })),
      transition("void => *", [animate("1100ms ease-out")])
    ])
  ]
})
export class InputComponent extends AbstractMenuPageComponent implements OnInit {
  plugins: Array<SegmentedBarItem> = [];
  selectedPlugin: string = "DrawingPad";
  drawings: Array<any> = [];
  iqkeyboardHelper: IQKeyboardHelper;

  constructor(protected menuComponent: MenuComponent,
              protected vcRef: ViewContainerRef,
              protected modalService: ModalDialogService,
              private zone: NgZone) {
    super(menuComponent, vcRef, modalService);
  }

  ngOnInit(): void {
    this.addPluginToSegmentedBar("DrawingPad");
    this.addPluginToSegmentedBar("NumKeyboard");
    this.addPluginToSegmentedBar("IQKeyboard");

    this.iqkeyboardHelper = new IQKeyboardHelper();
  }

  private addPluginToSegmentedBar(name: string) {
    let drawingPad = new SegmentedBarItem();
    drawingPad.title = name;
    this.plugins.push(drawingPad);
  }

  pluginChanged(args: PropertyChangeData): void {
    if (args.value === null) {
      return;
    }
    this.selectedPlugin = this.plugins[args.value].title;
  }

  getMyDrawing(pad: DrawingPad) {
    // then get the drawing (Bitmap on Android) of the drawingpad
    pad.getDrawing().then(data => {
      console.log(data);
      this.drawings.push(data);
      this.clearMyDrawing(pad);
    }, err => {
      console.log(err);
    });
  }

  clearMyDrawing(pad: DrawingPad) {
    pad.clearDrawing();
  }

  protected getPluginInfo(): PluginInfoWrapper {
    return new PluginInfoWrapper(
        // TODO
        "..",
        Array.of(
            new PluginInfo(
                "nativescript-drawingpad",
                "Text to Speech",
                "https://github.com/bradmartin/nativescript-texttospeech",
                "..."),

            new PluginInfo(
                "nativescript-numeric-keyboard",
                "Numeric Keyboard (iOS)",
                "https://github.com/EddyVerbruggen/nativescript-numeric-keyboard",
                "..."
            ),

            new PluginInfo(
                "https://github.com/tjvantoll/nativescript-IQKeyboardManager",
                "IQKeyboardManager (iOS)",
                "https://github.com/tjvantoll/nativescript-IQKeyboardManager",
                "Tame that wild beast  🐅  of a keyboard  ⌨️  by dropping in this library."
            )
        )
    );
  }
}