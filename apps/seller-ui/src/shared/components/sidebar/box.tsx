"use client";
import styled from "styled-components";

interface BoxProps {
  css?: React.CSSProperties;
}

export const Box = styled.div.attrs<BoxProps>((props) => ({
  style: props.css, //apply the css prop as inline style
}))<BoxProps>`
  box-sizing: border-box;
`;
