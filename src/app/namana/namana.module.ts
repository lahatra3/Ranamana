import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { NamanaRoutingModule } from './namana-routing.module';
import { BodyComponent } from './components/body/body.component';


@NgModule({
  declarations: [
    BodyComponent
  ],
  imports: [
    CommonModule,
    NamanaRoutingModule,
    NgOptimizedImage
  ],
  exports: [
    BodyComponent
  ]
})
export class NamanaModule { }
