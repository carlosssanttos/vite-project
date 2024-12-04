import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <MenuContainer>
      {/* Ícone do Menu */}
      <MenuIcon onClick={toggleMenu}>
        <div />
        <div />
        <div />
      </MenuIcon>

      {/* Itens do Menu */}
      {isOpen && (
        <MenuDropdown>
          <MenuItem onClick={() => console.log("Histórico de Metas clicado")}>
            Histórico de Metas
          </MenuItem>
          <MenuItem onClick={() => console.log("Histórico de Notificações clicado")}>
            Histórico de Notificações
          </MenuItem>
        </MenuDropdown>
      )}
    </MenuContainer>
  );
};

const MenuContainer = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1000;
`;

const MenuIcon = styled.div`
  width: 30px;
  height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;

  div {
    width: 100%;
    height: 4px;
    background-color: #fff; /* Cor branca para os traços */
    border-radius: 2px;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
`;

const MenuDropdown = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background-color: #333;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 200px;
  display: flex;
  flex-direction: column;
  padding: 8px;
`;

const MenuItem = styled.div`
  padding: 12px 16px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #444; /* Destaca o item ao passar o mouse */
  }
`;


export default HamburgerMenu;