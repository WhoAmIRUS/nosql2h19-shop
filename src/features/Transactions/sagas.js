import * as transactionTypes from "./actionTypes";
import * as transactionActions from "./actions";
import { put, takeLatest, call } from "@redux-saga/core/effects";
import * as API from "./api";
import * as userActions from "../Users/actions";
import { fetchReqAsync, fetchResAsync } from "../../commons/api";
import {exportToCsv} from "~/commons/utils";

export function* getTransactionsUserAll({
  payload: { id, options, filter = {} }
}) {
  try {
    const { transactions } = yield fetchReqAsync(API.getUserTransactions, {
      id,
      ...filter
    });
    yield put(transactionActions.getTransactionsUserAllSuccess(transactions));
    if (options?.withUser) {
      yield put(userActions.getUser(id));
    }
  } catch (error) {
    console.log(error);
    yield put(transactionActions.getTransactionsUserAllFail(error));
  }
}

export function* getTransaction({ payload: { id } }) {
  try {
    const { transaction } = yield fetchReqAsync(API.getUserTransaction, {
      id
    });
    yield put(transactionActions.getTransactionSuccess(transaction));
  } catch (error) {
    console.log(error);
    yield put(transactionActions.getTransactionFail(error));
  }
}

export function* importTransactions({ payload: { file, id } }) {
  try {
    yield fetchResAsync(API.importTransactions, file);
    yield put(transactionActions.importTransactionsSuccess());
    yield put(
      transactionActions.getTransactionsUserAll(id, { withUser: true })
    );
  } catch (error) {
    yield put(transactionActions.importTransactionsFail(error));
  }
}

export function* exportTransactions({ payload: { id } }) {
  try {
    const res = yield fetchReqAsync(API.exportTransactions, {
      id,
      collection: "transactions"
    });
    exportToCsv('transactions.csv', [Object.keys(res[0]), ...res.map(e => Object.values(e))])
  } catch (error) {
    console.log(error);
  }
}

function* watchTransactions() {
  yield takeLatest(
    transactionTypes.TRANSACTIONS_USER_ALL_GET,
    getTransactionsUserAll
  );
  yield takeLatest(transactionTypes.TRANSACTION_GET, getTransaction);
  yield takeLatest(transactionTypes.TRANSACTIONS_IMPORT, importTransactions);
  yield takeLatest(transactionTypes.TRANSACTIONS_EXPORT, exportTransactions);
}

export default watchTransactions;
