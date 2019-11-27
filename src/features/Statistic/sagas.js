import * as statisticTypes from "./actionTypes";
import * as statisticActions from "./actions";
import { put, takeLatest } from "@redux-saga/core/effects";
import * as API from "./api";
import { fetchReqAsync } from "~/commons/api";

export function* getStatisticUserAll({ payload: { id } }) {
  try {
    const { categories } = yield fetchReqAsync(API.getStatUserAll, { id });
    yield put(statisticActions.getStatisticUserAllSuccess(categories));
  } catch (error) {
    console.log(error);
    yield put(statisticActions.getStatisticUserAllFail(error));
  }
}

export function* getStatisticUserPeriod({
  payload: { id, startDate, endDate }
}) {
  try {
    const { categories } = yield fetchReqAsync(API.getStatUserPeriod, {
      id,
      startDate,
      endDate
    });
    yield put(statisticActions.getStatisticUserPeriodSuccess(categories));
  } catch (error) {
    console.log(error);
    yield put(statisticActions.getStatisticUserPeriodFail(error));
  }
}

function* watchStatistic() {
  yield takeLatest(statisticTypes.STATISTIC_USER_ALL_GET, getStatisticUserAll);
  yield takeLatest(
    statisticTypes.STATISTIC_USER_PERIOD_GET,
    getStatisticUserPeriod
  );
}

export default watchStatistic;
