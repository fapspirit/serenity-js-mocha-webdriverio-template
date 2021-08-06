import { resolve } from 'path';
import { ConsoleReporter } from '@serenity-js/console-reporter';
import { SerenityBDDReporter } from '@serenity-js/serenity-bdd';
import { ArtifactArchiver } from '@serenity-js/core';
import { Actors } from './src';
import { Photographer, TakePhotosOfInteractions } from '@serenity-js/webdriverio';
import * as isCI from 'is-ci';

export const config = {

    baseUrl: 'https://serenity-js.org/',

    framework: '@serenity-js/webdriverio',

    serenity: {
        actors: new Actors(),
        crew: [
            ArtifactArchiver.storingArtifactsAt('./target/site/serenity'),
            Photographer.whoWill(TakePhotosOfInteractions),     // slower execution, more comprehensive reports
            // Photographer.whoWill(TakePhotosOfFailures),      // fast execution, screenshots only when tests fail
            ConsoleReporter.forDarkTerminals(),
            new SerenityBDDReporter(),
        ]
    },

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
    },

    specs: [
        './spec/**/*.spec.ts',
    ],

    // native WebdriverIO reporters
    reporters: [
        'spec',
    ],

    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            transpileOnly: true,
            project: resolve(__dirname, './tsconfig.json'),
        },
    },

    // headless: true,
    automationProtocol: 'devtools',

    runner: 'local',

    maxInstances: 1,

    capabilities: [{

        browserName: 'chrome',
        'goog:chromeOptions': {
            args: [
                '--disable-infobars',
                '--no-sandbox',
                '--disable-gpu',
                '--window-size=1024x768',
            ].concat(isCI ? ['--headless'] : [])    // run in headless mode on the CI server,
        }
    }],

    logLevel: 'debug',

    waitforTimeout: 10000,

    connectionRetryTimeout: 90000,

    connectionRetryCount: 3,
};
