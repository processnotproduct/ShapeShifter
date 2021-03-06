import 'hammerjs';

import {
  CanvasComponent,
  CanvasContainerDirective,
  CanvasLayersDirective,
  CanvasOverlayDirective,
  CanvasRulerDirective,
} from './components/canvas';
import {
  ConfirmDialogComponent,
  DemoDialogComponent,
  DialogService,
} from './components/dialogs';
import {
  LayerListTreeComponent,
  LayerTimelineComponent,
  LayerTimelineDirective,
  TimelineAnimationRowComponent,
} from './components/layertimeline';
import { PlaybackComponent } from './components/playback/playback.component';
import { PropertyInputComponent } from './components/propertyinput/propertyinput.component';
import { DropTargetDirective } from './components/root/droptarget.directive';
import { RootComponent } from './components/root/root.component';
import { ScrollGroupDirective } from './components/scrollgroup/scrollgroup.directive';
import { SplitterComponent } from './components/splitter/splitter.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ActionModeService } from './services/actionmode/actionmode.service';
import { AnimatorService } from './services/animator/animator.service';
import { ClipboardService } from './services/clipboard/clipboard.service';
import { FileExportService } from './services/export/fileexport.service';
import { FileImportService } from './services/import/fileimport.service';
import { PlaybackService } from './services/playback/playback.service';
import { ShortcutService } from './services/shortcut/shortcut.service';
import { reducer } from './store';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  MdButtonModule,
  MdDialogModule,
  MdIconModule,
  MdIconRegistry,
  MdInputModule,
  MdMenuModule,
  MdOptionModule,
  MdRadioModule,
  MdSnackBarModule,
  MdToolbarModule,
  MdTooltipModule,
} from '@angular/material';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [
    RootComponent,
    CanvasComponent,
    CanvasContainerDirective,
    CanvasLayersDirective,
    CanvasOverlayDirective,
    CanvasRulerDirective,
    ConfirmDialogComponent,
    DemoDialogComponent,
    DropTargetDirective,
    LayerListTreeComponent,
    LayerTimelineComponent,
    LayerTimelineDirective,
    PlaybackComponent,
    PropertyInputComponent,
    ScrollGroupDirective,
    SplitterComponent,
    TimelineAnimationRowComponent,
    ToolbarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    HttpModule,
    StoreModule.provideStore(reducer),
    // Angular material components.
    MdButtonModule,
    MdDialogModule,
    MdIconModule,
    MdInputModule,
    MdMenuModule,
    MdOptionModule,
    MdRadioModule,
    MdSnackBarModule,
    MdToolbarModule,
    MdTooltipModule,
  ],
  providers: [
    ActionModeService,
    AnimatorService,
    ClipboardService,
    DialogService,
    FileExportService,
    FileImportService,
    PlaybackService,
    ShortcutService,
  ],
  entryComponents: [
    ConfirmDialogComponent,
    DemoDialogComponent,
  ],
  bootstrap: [RootComponent],
})
export class AppModule {

  constructor(
    readonly mdIconRegistry: MdIconRegistry,
    readonly sanitizer: DomSanitizer) {
    mdIconRegistry
      // Logo.
      .addSvgIcon('shapeshifter', sanitizer.bypassSecurityTrustResourceUrl('assets/shapeshifter.svg'))
      // Icons.
      .addSvgIcon('addlayer', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/addlayer.svg'))
      .addSvgIcon('addanimation', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/addanimation.svg'))
      .addSvgIcon('autofix', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/autofix.svg'))
      .addSvgIcon('demos', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/demos.svg'))
      .addSvgIcon('reverse', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/reverse.svg'))
      .addSvgIcon('animation', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/animation.svg'))
      .addSvgIcon('collection', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/collection.svg'))
      .addSvgIcon('animationblock', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/animationblock.svg'))
      .addSvgIcon('clippathlayer', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/clippathlayer.svg'))
      .addSvgIcon('grouplayer', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/grouplayer.svg'))
      .addSvgIcon('pathlayer', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/pathlayer.svg'))
      .addSvgIcon('vectorlayer', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/vectorlayer.svg'))
      // Cursors.
      .addSvgIcon('selectioncursor', sanitizer.bypassSecurityTrustResourceUrl('assets/cursorsselectioncursor.svg'));
  }
}
