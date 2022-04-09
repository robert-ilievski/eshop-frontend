import Button from '@mui/material/Button';
import {Link} from "react-router-dom";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {Edit} from '@mui/icons-material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {wrapComponent} from "react-snackbar-alert";
import {useDispatch, useSelector} from 'react-redux';
import React, {useEffect} from 'react';
import {CategoryActions} from '../../redux/actions/categoryActions';

const AdminPanel = wrapComponent(function ({createSnackbar}) {
    const dispatch = useDispatch();
    const categories = useSelector(state => state.category.categories);

    useEffect(() => {
        dispatch(CategoryActions.fetchAllCategories((success, response) => {

        }));
    }, []);

    const handleCategoryDelete = id => {
        dispatch(CategoryActions.deleteCategory(id));
    };

    return (
        <div className={`container p-5`}>
            <div>
                <Button component={Link}
                        to={'/categories/add'}
                        variant="contained" color="primary"
                        className={`text-white text-decoration-none float-right`}
                >
                    ADD CATEGORY
                </Button>
                <h3>
                    Categories
                </h3>
                <div className={`pt-4`}>
                    <TableContainer component={Paper}>
                        <Table className={``} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" padding="none" width={70}>#</TableCell>
                                    <TableCell align="left">Category</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categories &&
                                categories.map((category, i) => (
                                    <TableRow key={category.id}>
                                        <TableCell component="th" scope="row" name="categoryId" padding="none"
                                                   align="center">
                                            {i + 1}
                                        </TableCell>
                                        <TableCell align="left">{category.name}</TableCell>
                                        <TableCell align="center">
                                            <Button onClick={() => {
                                                // eslint-disable-next-line no-unused-expressions
                                                ( window.confirm('Are you sure you wish to delete this category?')) ?
                                                    handleCategoryDelete(category.id)
                                                    : null
                                            }}>
                                                <HighlightOffIcon/>
                                            </Button>
                                            <Button
                                                href={`/categories/edit/${category.id}`}
                                            >
                                                <Edit/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
            <div className={`pt-4`}>
                <Button component={Link}
                        to={'/create-postman'}
                        variant="contained" color="primary"
                        className={`text-white text-decoration-none`}
                >
                    Create Postman
                </Button>
            </div>
        </div>
    );
});

export default AdminPanel;