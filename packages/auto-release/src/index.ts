#!/usr/bin/env node

export const hello = () => console.log("hello");
export const addFunction = (a: number, b: number) => a + b;

(() => {
  console.log("hello version 2")
})()

