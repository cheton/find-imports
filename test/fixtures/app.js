import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import express from 'express';
import engines from 'consolidate';
import errorhandler from 'errorhandler';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import multiparty from 'connect-multiparty';
import connectRestreamer from 'connect-restreamer';
import methodOverride from 'method-override';
import morgan from 'morgan';
import compress from 'compression';
import serveStatic from 'serve-static';
import session from 'express-session';
import FileStore from 'session-file-store';
import i18next from 'i18next';
import i18nextBackend from 'i18next-node-fs-backend';
import del from 'del';
import {
    LanguageDetector as i18nextLanguageDetector,
    handle as i18nextHandle
} from 'i18next-express-middleware';
import urljoin from './lib/urljoin';
import log from './lib/log';
import settings from './config/settings';
import api from './api';
import errclient from './lib/middleware/errclient';
import errlog from './lib/middleware/errlog';
import errnotfound from './lib/middleware/errnotfound';
import errserver from './lib/middleware/errserver';

// Required by consolidate.js
import 'hogan.js';

// Relative Imports
import relativeStyles from './relative.styl';
import './relative.css';

// Absolute Imports
import absoluteStyles from '/absolute.styl';
import '/absolute.css';
