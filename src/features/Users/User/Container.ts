import { connect } from 'react-redux'
import { State } from "../../../reducer";
import User from "./User";
import * as usersActions  from "../actions";
import * as transactionActions  from "../../Transactions/actions";
import { userById, UserPropsGetterInterface } from "../selectors";
import {UsersDataState} from "../reducer";
import {transactionsSelector} from "../../Transactions/selectors";
import {TransactionDataState} from "../../Transactions/reducer";

export interface ListContainerStateToProps {
    user: UsersDataState,
    transactions: Array<TransactionDataState>
}

const mapStateToProps = (state: State, ownProps: UserPropsGetterInterface): ListContainerStateToProps => ({
    user: userById(state, ownProps),
    transactions: transactionsSelector(state)
})

const mapDefaultProps = {
    getUser: usersActions.getUser,
    getUserTransactions: transactionActions.getTransactionsUserAll
}

export default connect(mapStateToProps, mapDefaultProps)(User)