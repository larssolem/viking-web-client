import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import { rootReducer } from './rootReducer.js'
import { Socket } from '../utils/Socket'
import {socketMiddleware} from "../middleware/socket.js";

export const store = configureStore({
    reducer: rootReducer,
    middleware: [socketMiddleware(new Socket()), ...getDefaultMiddleware()],
})