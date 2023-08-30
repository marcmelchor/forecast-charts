import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, isDevMode } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { appReducer, metaReducers } from './Domain/state/app.state';
import { AppRoutingModule } from './app-routing.module';
import { ForecastDataEffect } from './Domain/state/forecast-data/forecast-data.effect';
import { TestCaseEffect } from './Domain/state/test-case/test-case.effect';
import { UserComponent } from './UI/user/user.component';
import { UserEffect } from './Domain/state/user/user.effect';
import { MainComponent } from './UI/main/main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './UI/widgets/button/button.component';
import { SelectComponent } from './UI/widgets/select/select.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    MainComponent,
    ButtonComponent,
    SelectComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot(appReducer, { metaReducers }),
    EffectsModule.forRoot([ForecastDataEffect, UserEffect, TestCaseEffect]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
