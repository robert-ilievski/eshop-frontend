import './App.css';
import {Layout} from "./layout/layout";
import RoutesConfig from "./auth/RoutesConfig";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {AuthActions} from "./redux/actions/authActions";
import {AUTH_TOKEN} from "./axios/axiosInstance";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(AuthActions.updateToken(localStorage.getItem(AUTH_TOKEN)));
  }, [dispatch]);

  return (
      <Layout>
        <RoutesConfig/>
      </Layout>
  );
}

export default App;
