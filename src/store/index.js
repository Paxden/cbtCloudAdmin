/**
 * Store Index
 * Exports store and hooks
 */

import { useDispatch, useSelector } from 'react-redux';
import { store } from './store';

export { store };

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export default store;