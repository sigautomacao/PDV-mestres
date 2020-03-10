import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxCurrencyModule } from "ngx-currency";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PDVComponent } from './pages/pdv/pdv.component';
import { CozinhaComponent } from './pages/cozinha/cozinha.component';

import { registerLocaleData } from '@angular/common';
import localeBr from '@angular/common/locales/pt';
import localeBrExtra from '@angular/common/locales/extra/pt';
import { RetiradaComponent } from './pages/retirada/retirada.component';

// the second parameter 'fr-FR' is optional
registerLocaleData(localeBr, 'pt', localeBrExtra);

@NgModule({
   declarations: [
      AppComponent,
      PDVComponent,
      CozinhaComponent,
      RetiradaComponent
   ],
   imports: [
      BrowserModule,
      NgbModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      NgxCurrencyModule.forRoot({
         align: "right",
         allowNegative: true,
         allowZero: true,
         decimal: ",",
         precision: 2,
         prefix: "R$ ",
         suffix: "",
         thousands: ".",
         nullable: true
      })
   ],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule { }
