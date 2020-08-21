import React, { useState, useEffect, useCallback } from 'react';

import api from '../../services/api'

import { Container, PTable, Pagination, PaginationButton, PaginationItem } from './styles';

function Table() {
    const [users, setUsers] = useState([])
    const [total, setTotal] = useState(null)
    const [limit, setLimit] = useState(5)
    const [pages, setPages] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        async function loadProducts() {
            const response = await api.get(`/cadusuario?page=${currentPage}&limit=${limit}`)
            setTotal(response.headers['x-total-count'])
            const totalPages = Math.ceil(total / limit)

            const arrayPages = []
            for (let i = 1; i <= totalPages; i++) {
                arrayPages.push(i)
            }

            setPages(arrayPages)
            setUsers(response.data)
        }

        loadProducts()
    }, [currentPage, limit, total])

    const limits = useCallback(e => {
        setLimit(e.target.value)
        setCurrentPage(1)
    }, [])

    return (
        <Container>
            <h3>Tabela de Usuários</h3>
            <select onChange={limits}>
                <option value='5'>5</option>
                <option value='10'>10</option>
                <option value='15'>15</option>
            </select>
            <PTable>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.nome}</td>
                            <td>{user.email}</td>
                            <td>{user.telefone}</td>
                        </tr>
                    ))}
                </tbody>
            </PTable>
            <Pagination>
                <div>Qtd {total}</div>

                <PaginationButton>
                    {currentPage > 1 && (
                        <PaginationItem onClick={() => setCurrentPage(currentPage - 1)}>
                            Previous
                        </PaginationItem>
                    )}

                    {pages.map(page => (
                        <PaginationItem
                            isSelect={page === currentPage}
                            key={page}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </PaginationItem>
                    ))}
                    {currentPage < pages.length && (
                        <PaginationItem onClick={() => setCurrentPage(currentPage + 1)}>
                            Next
                        </PaginationItem>
                    )

                    }
                </PaginationButton>
            </Pagination>
        </Container>
    );
}

export default Table;