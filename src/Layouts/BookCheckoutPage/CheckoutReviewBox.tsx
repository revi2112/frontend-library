// this page displays the boc on the righthand side 
// displays book copies avalaibity and sign in to authrorize before reviw

import { Link } from "react-router-dom";
import BookModel from "../../Models/BookModel";
import { useAuth0 } from "@auth0/auth0-react";

export const CheckoutAndReviewBox: React.FC<{book : BookModel | undefined , mobile: boolean}> = (props) => {

    const {isAuthenticated, loginWithRedirect} = useAuth0();
    return(
        <div className={props.mobile ? 'card d-flex mt-5' : 'card col-3 container d-flex mb-5' }>
            <div className="card-body">
                <div className="mt-3">
                    <p>
                        <b>0/5 </b>
                        books checked out
                    </p>
                    <hr/>
                    {props.book && props.book.copiesAvailable && props.book.copiesAvailable >0 ?
                    <h4 className="text-success">Available</h4>:<h4 className="text-danger">Wait List</h4>
                    }
                    <div className="row">
                        <p className="col-6 lead">
                            <b>{props.book?.copies} </b>
                            Copies
                        </p>
                        <p className="col-6 lead">
                            <b>{props.book?.copiesAvailable} </b>
                            Available
                        </p>
                    </div>
                </div>
                <Link to='/#' className="btn btn-success btn-lg">Sign in</Link>
                {!isAuthenticated? 
                            <button className='btn main-color btn-lg text-white' onClick={() => loginWithRedirect()}>
                            Sign up
                        </button>:
                         <Link to='/messages' type='button' className='btn main-color btn-lg px-4 me-md-2 fw-bold text-white'>
                         Library Services
                     </Link>
                        
                    }
                <hr/>
                <p className="mt-3">
                    This number can cahnge until placing order has been complete
                </p>
                <p>
                    Sign in to be able to leave a review
                </p>
            </div>
        </div>
    )
}