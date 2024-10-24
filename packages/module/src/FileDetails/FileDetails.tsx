import React, { PropsWithChildren } from 'react';
import { Flex, Stack, StackItem } from '@patternfly/react-core';
import path from 'path-browserify';
interface FileDetailsProps {
  /** Name of file, including extension */
  fileName: string;
}

// source https://gist.github.com/ppisarczyk/43962d06686722d26d176fad46879d41
// FIXME We could probably check against the PF Language hash to trim this down to what the code editor supports.
// I can also see an argument to leaving this open, or researching what the third-party we use for uploads is using
// so we can better scrape this from that. It gives us back stuff like 'application/x-yaml', while we really just need
// a mapping of 'yml' to 'yaml.' I'm leery of splitting strings with unknown format.
export const extensionToLanguage = {
  '1': 'Groff',
  '2': 'Groff',
  '3': 'Groff',
  '4': 'Groff',
  '5': 'Groff',
  '6': 'Groff',
  '7': 'Groff',
  '8': 'Groff',
  '9': 'Groff',
  abap: 'ABAP',
  asc: 'Public Key',
  ash: 'AGS Script',
  ampl: 'AMPL',
  mod: 'XML',
  g4: 'ANTLR',
  apib: 'API Blueprint',
  apl: 'APL',
  dyalog: 'APL',
  asp: 'ASP',
  asax: 'ASP',
  ascx: 'ASP',
  ashx: 'ASP',
  asmx: 'ASP',
  aspx: 'ASP',
  axd: 'ASP',
  dats: 'ATS',
  hats: 'ATS',
  sats: 'ATS',
  as: 'ActionScript',
  adb: 'Ada',
  ada: 'Ada',
  ads: 'Ada',
  agda: 'Agda',
  als: 'Alloy',
  apacheconf: 'ApacheConf',
  vhost: 'Nginx',
  cls: 'Visual Basic',
  applescript: 'AppleScript',
  scpt: 'AppleScript',
  arc: 'Arc',
  ino: 'Arduino',
  asciidoc: 'AsciiDoc',
  adoc: 'AsciiDoc',
  aj: 'AspectJ',
  asm: 'Assembly',
  a51: 'Assembly',
  inc: 'SourcePawn',
  nasm: 'Assembly',
  aug: 'Augeas',
  ahk: 'AutoHotkey',
  ahkl: 'AutoHotkey',
  au3: 'AutoIt',
  awk: 'Awk',
  auk: 'Awk',
  gawk: 'Awk',
  mawk: 'Awk',
  nawk: 'Awk',
  bat: 'Batchfile',
  cmd: 'Batchfile',
  befunge: 'Befunge',
  bison: 'Bison',
  bb: 'BlitzBasic',
  decls: 'BlitzBasic',
  bmx: 'BlitzMax',
  bsv: 'Bluespec',
  boo: 'Boo',
  b: 'Limbo',
  bf: 'HyPhy',
  brs: 'Brightscript',
  bro: 'Bro',
  c: 'C',
  cats: 'C',
  h: 'Objective-C',
  idc: 'C',
  w: 'C',
  cs: 'Smalltalk',
  cake: 'CoffeeScript',
  cshtml: 'C#',
  csx: 'C#',
  cpp: 'C++',
  'c++': 'C++',
  cc: 'C++',
  cp: 'Component Pascal',
  cxx: 'C++',
  'h++': 'C++',
  hh: 'Hack',
  hpp: 'C++',
  hxx: 'C++',
  inl: 'C++',
  ipp: 'C++',
  tcc: 'C++',
  tpp: 'C++',
  'c-objdump': 'C-ObjDump',
  chs: 'C2hs Haskell',
  clp: 'CLIPS',
  cmake: 'CMake',
  'cmake.in': 'CMake',
  cob: 'COBOL',
  cbl: 'COBOL',
  ccp: 'COBOL',
  cobol: 'COBOL',
  cpy: 'COBOL',
  css: 'CSS',
  csv: 'CSV',
  capnp: "Cap'n Proto",
  mss: 'CartoCSS',
  ceylon: 'Ceylon',
  chpl: 'Chapel',
  ch: 'xBase',
  ck: 'ChucK',
  cirru: 'Cirru',
  clw: 'Clarion',
  icl: 'Clean',
  dcl: 'Clean',
  click: 'Click',
  clj: 'Clojure',
  boot: 'Clojure',
  cl2: 'Clojure',
  cljc: 'Clojure',
  cljs: 'Clojure',
  'cljs.hl': 'Clojure',
  cljscm: 'Clojure',
  cljx: 'Clojure',
  hic: 'Clojure',
  coffee: 'CoffeeScript',
  _coffee: 'CoffeeScript',
  cjsx: 'CoffeeScript',
  cson: 'CoffeeScript',
  iced: 'CoffeeScript',
  cfm: 'ColdFusion',
  cfml: 'ColdFusion',
  cfc: 'ColdFusion CFC',
  lisp: 'NewLisp',
  asd: 'Common Lisp',
  cl: 'OpenCL',
  l: 'PicoLisp',
  lsp: 'NewLisp',
  ny: 'Common Lisp',
  podsl: 'Common Lisp',
  sexp: 'Common Lisp',
  cps: 'Component Pascal',
  coq: 'Coq',
  v: 'Verilog',
  cppobjdump: 'Cpp-ObjDump',
  'c++-objdump': 'Cpp-ObjDump',
  'c++objdump': 'Cpp-ObjDump',
  'cpp-objdump': 'Cpp-ObjDump',
  'cxx-objdump': 'Cpp-ObjDump',
  creole: 'Creole',
  cr: 'Crystal',
  feature: 'Cucumber',
  cu: 'Cuda',
  cuh: 'Cuda',
  cy: 'Cycript',
  pyx: 'Cython',
  pxd: 'Cython',
  pxi: 'Cython',
  d: 'Makefile',
  di: 'D',
  'd-objdump': 'D-ObjDump',
  com: 'DIGITAL Command Language',
  dm: 'DM',
  zone: 'DNS Zone',
  arpa: 'DNS Zone',
  darcspatch: 'Darcs Patch',
  dpatch: 'Darcs Patch',
  dart: 'Dart',
  diff: 'Diff',
  patch: 'Diff',
  dockerfile: 'Dockerfile',
  djs: 'Dogescript',
  dylan: 'Dylan',
  dyl: 'Dylan',
  intr: 'Dylan',
  lid: 'Dylan',
  E: 'E',
  ecl: 'ECLiPSe',
  eclxml: 'ECL',
  sch: 'KiCad',
  brd: 'KiCad',
  epj: 'Ecere Projects',
  e: 'Eiffel',
  ex: 'Elixir',
  exs: 'Elixir',
  elm: 'Elm',
  el: 'Emacs Lisp',
  emacs: 'Emacs Lisp',
  'emacs.desktop': 'Emacs Lisp',
  em: 'EmberScript',
  emberscript: 'EmberScript',
  erl: 'Erlang',
  es: 'JavaScript',
  escript: 'Erlang',
  hrl: 'Erlang',
  xrl: 'Erlang',
  yrl: 'Erlang',
  fs: 'GLSL',
  fsi: 'F#',
  fsx: 'F#',
  fx: 'HLSL',
  flux: 'FLUX',
  f90: 'FORTRAN',
  f: 'Forth',
  f03: 'FORTRAN',
  f08: 'FORTRAN',
  f77: 'FORTRAN',
  f95: 'FORTRAN',
  for: 'Forth',
  fpp: 'FORTRAN',
  factor: 'Factor',
  fy: 'Fancy',
  fancypack: 'Fancy',
  fan: 'Fantom',
  'eam.fs': 'Formatted',
  fth: 'Forth',
  '4th': 'Forth',
  forth: 'Forth',
  fr: 'Text',
  frt: 'Forth',
  ftl: 'FreeMarker',
  g: 'GAP',
  gco: 'G-code',
  gcode: 'G-code',
  gms: 'GAMS',
  gap: 'GAP',
  gd: 'GDScript',
  gi: 'GAP',
  tst: 'Scilab',
  s: 'GAS',
  ms: 'MAXScript',
  glsl: 'GLSL',
  fp: 'GLSL',
  frag: 'JavaScript',
  frg: 'GLSL',
  fsh: 'GLSL',
  fshader: 'GLSL',
  geo: 'GLSL',
  geom: 'GLSL',
  glslv: 'GLSL',
  gshader: 'GLSL',
  shader: 'GLSL',
  vert: 'GLSL',
  vrx: 'GLSL',
  vsh: 'GLSL',
  vshader: 'GLSL',
  gml: 'XML',
  kid: 'Genshi',
  ebuild: 'Gentoo Ebuild',
  eclass: 'Gentoo Eclass',
  po: 'Gettext Catalog',
  pot: 'Gettext Catalog',
  glf: 'Glyph',
  gp: 'Gnuplot',
  gnu: 'Gnuplot',
  gnuplot: 'Gnuplot',
  plot: 'Gnuplot',
  plt: 'Gnuplot',
  go: 'Go',
  golo: 'Golo',
  gs: 'JavaScript',
  gst: 'Gosu',
  gsx: 'Gosu',
  vark: 'Gosu',
  grace: 'Grace',
  gradle: 'Gradle',
  gf: 'Grammatical Framework',
  graphql: 'GraphQL',
  dot: 'Graphviz (DOT)',
  gv: 'Graphviz (DOT)',
  man: 'Groff',
  '1in': 'Groff',
  '1m': 'Groff',
  '1x': 'Groff',
  '3in': 'Groff',
  '3m': 'Groff',
  '3qt': 'Groff',
  '3x': 'Groff',
  me: 'Groff',
  n: 'Nemerle',
  rno: 'Groff',
  roff: 'Groff',
  groovy: 'Groovy',
  grt: 'Groovy',
  gtpl: 'Groovy',
  gvy: 'Groovy',
  gsp: 'Groovy Server Pages',
  hcl: 'HCL',
  tf: 'HCL',
  hlsl: 'HLSL',
  fxh: 'HLSL',
  hlsli: 'HLSL',
  html: 'HTML',
  htm: 'HTML',
  'html.hl': 'HTML',
  st: 'Smalltalk',
  xht: 'HTML',
  xhtml: 'HTML',
  mustache: 'HTML+Django',
  jinja: 'HTML+Django',
  eex: 'HTML+EEX',
  erb: 'HTML+ERB',
  'erb.deface': 'HTML+ERB',
  phtml: 'HTML+PHP',
  http: 'HTTP',
  php: 'PHP',
  haml: 'Haml',
  'haml.deface': 'Haml',
  handlebars: 'Handlebars',
  hbs: 'Handlebars',
  hb: 'Harbour',
  hs: 'Haskell',
  hsc: 'Haskell',
  hx: 'Haxe',
  hxsl: 'Haxe',
  hy: 'Hy',
  pro: 'QMake',
  dlm: 'IDL',
  ipf: 'IGOR Pro',
  ini: 'INI',
  cfg: 'INI',
  prefs: 'INI',
  properties: 'INI',
  irclog: 'IRC log',
  weechatlog: 'IRC log',
  idr: 'Idris',
  lidr: 'Idris',
  ni: 'Inform 7',
  i7x: 'Inform 7',
  iss: 'Inno Setup',
  io: 'Io',
  ik: 'Ioke',
  thy: 'Isabelle',
  ijs: 'J',
  flex: 'JFlex',
  jflex: 'JFlex',
  json: 'JSON',
  geojson: 'JSON',
  lock: 'JSON',
  topojson: 'JSON',
  json5: 'JSON5',
  jsonld: 'JSONLD',
  jq: 'JSONiq',
  jsx: 'JSX',
  jade: 'Jade',
  j: 'Objective-J',
  java: 'Java',
  jsp: 'Java Server Pages',
  js: 'JavaScript',
  _js: 'JavaScript',
  bones: 'JavaScript',
  es6: 'JavaScript',
  jake: 'JavaScript',
  jsb: 'JavaScript',
  jscad: 'JavaScript',
  jsfl: 'JavaScript',
  jsm: 'JavaScript',
  jss: 'JavaScript',
  njs: 'JavaScript',
  pac: 'JavaScript',
  sjs: 'JavaScript',
  ssjs: 'JavaScript',
  'sublime-build': 'JavaScript',
  'sublime-commands': 'JavaScript',
  'sublime-completions': 'JavaScript',
  'sublime-keymap': 'JavaScript',
  'sublime-macro': 'JavaScript',
  'sublime-menu': 'JavaScript',
  'sublime-mousemap': 'JavaScript',
  'sublime-project': 'JavaScript',
  'sublime-settings': 'JavaScript',
  'sublime-theme': 'JavaScript',
  'sublime-workspace': 'JavaScript',
  // eslint-disable-next-line camelcase
  sublime_metrics: 'JavaScript',
  // eslint-disable-next-line camelcase
  sublime_session: 'JavaScript',
  xsjs: 'JavaScript',
  xsjslib: 'JavaScript',
  jl: 'Julia',
  ipynb: 'Jupyter Notebook',
  krl: 'KRL',
  // eslint-disable-next-line camelcase
  kicad_pcb: 'KiCad',
  kit: 'Kit',
  kt: 'Kotlin',
  ktm: 'Kotlin',
  kts: 'Kotlin',
  lfe: 'LFE',
  ll: 'LLVM',
  lol: 'LOLCODE',
  lsl: 'LSL',
  lslp: 'LSL',
  lvproj: 'LabVIEW',
  lasso: 'Lasso',
  las: 'Lasso',
  lasso8: 'Lasso',
  lasso9: 'Lasso',
  ldml: 'Lasso',
  latte: 'Latte',
  lean: 'Lean',
  hlean: 'Lean',
  less: 'Less',
  lex: 'Lex',
  ly: 'LilyPond',
  ily: 'LilyPond',
  m: 'Objective-C',
  ld: 'Linker Script',
  lds: 'Linker Script',
  liquid: 'Liquid',
  lagda: 'Literate Agda',
  litcoffee: 'Literate CoffeeScript',
  lhs: 'Literate Haskell',
  ls: 'LoomScript',
  _ls: 'LiveScript',
  xm: 'Logos',
  x: 'Logos',
  xi: 'Logos',
  lgt: 'Logtalk',
  logtalk: 'Logtalk',
  lookml: 'LookML',
  lua: 'Lua',
  fcgi: 'Shell',
  nse: 'Lua',
  // eslint-disable-next-line camelcase
  pd_lua: 'Lua',
  rbxs: 'Lua',
  wlua: 'Lua',
  mumps: 'M',
  m4: 'M4Sugar',
  mcr: 'MAXScript',
  mtml: 'MTML',
  muf: 'MUF',
  mak: 'Makefile',
  mk: 'Makefile',
  mkfile: 'Makefile',
  mako: 'Mako',
  mao: 'Mako',
  md: 'Markdown',
  markdown: 'Markdown',
  mkd: 'Markdown',
  mkdn: 'Markdown',
  mkdown: 'Markdown',
  ron: 'Markdown',
  mask: 'Mask',
  mathematica: 'Mathematica',
  cdf: 'Mathematica',
  ma: 'Mathematica',
  mt: 'Mathematica',
  nb: 'Text',
  nbp: 'Mathematica',
  wl: 'Mathematica',
  wlt: 'Mathematica',
  matlab: 'Matlab',
  maxpat: 'Max',
  maxhelp: 'Max',
  maxproj: 'Max',
  mxt: 'Max',
  pat: 'Max',
  mediawiki: 'MediaWiki',
  wiki: 'MediaWiki',
  moo: 'Moocode',
  metal: 'Metal',
  minid: 'MiniD',
  druby: 'Mirah',
  duby: 'Mirah',
  mir: 'Mirah',
  mirah: 'Mirah',
  mo: 'Modelica',
  mms: 'Module Management System',
  mmk: 'Module Management System',
  monkey: 'Monkey',
  moon: 'MoonScript',
  myt: 'Myghty',
  ncl: 'Text',
  nl: 'NewLisp',
  nsi: 'NSIS',
  nsh: 'NSIS',
  axs: 'NetLinx',
  axi: 'NetLinx',
  'axs.erb': 'NetLinx+ERB',
  'axi.erb': 'NetLinx+ERB',
  nlogo: 'NetLogo',
  nginxconf: 'Nginx',
  nim: 'Nimrod',
  nimrod: 'Nimrod',
  ninja: 'Ninja',
  nit: 'Nit',
  nix: 'Nix',
  nu: 'Nu',
  numpy: 'NumPy',
  numpyw: 'NumPy',
  numsc: 'NumPy',
  ml: 'OCaml',
  eliom: 'OCaml',
  eliomi: 'OCaml',
  ml4: 'OCaml',
  mli: 'OCaml',
  mll: 'OCaml',
  mly: 'OCaml',
  objdump: 'ObjDump',
  mm: 'XML',
  sj: 'Objective-J',
  omgrofl: 'Omgrofl',
  opa: 'Opa',
  opal: 'Opal',
  opencl: 'OpenCL',
  p: 'OpenEdge ABL',
  scad: 'OpenSCAD',
  org: 'Org',
  ox: 'Ox',
  oxh: 'Ox',
  oxo: 'Ox',
  oxygene: 'Oxygene',
  oz: 'Oz',
  pwn: 'PAWN',
  aw: 'PHP',
  ctp: 'PHP',
  php3: 'PHP',
  php4: 'PHP',
  php5: 'PHP',
  phps: 'PHP',
  phpt: 'PHP',
  pls: 'PLSQL',
  pck: 'PLSQL',
  pkb: 'PLSQL',
  pks: 'PLSQL',
  plb: 'PLSQL',
  plsql: 'PLSQL',
  sql: 'SQLPL',
  pov: 'POV-Ray SDL',
  pan: 'Pan',
  psc: 'Papyrus',
  parrot: 'Parrot',
  pasm: 'Parrot Assembly',
  pir: 'Parrot Internal Representation',
  pas: 'Pascal',
  dfm: 'Pascal',
  dpr: 'Pascal',
  lpr: 'Pascal',
  pp: 'Puppet',
  pl: 'Prolog',
  al: 'Perl',
  cgi: 'Shell',
  perl: 'Perl',
  ph: 'Perl',
  plx: 'Perl',
  pm: 'Perl6',
  pod: 'Pod',
  psgi: 'Perl',
  t: 'Turing',
  '6pl': 'Perl6',
  '6pm': 'Perl6',
  nqp: 'Perl6',
  p6: 'Perl6',
  p6l: 'Perl6',
  p6m: 'Perl6',
  pl6: 'Perl6',
  pm6: 'Perl6',
  pkl: 'Pickle',
  pig: 'PigLatin',
  pike: 'Pike',
  pmod: 'Pike',
  pogo: 'PogoScript',
  pony: 'Pony',
  ps: 'PostScript',
  eps: 'PostScript',
  ps1: 'PowerShell',
  psd1: 'PowerShell',
  psm1: 'PowerShell',
  pde: 'Processing',
  prolog: 'Prolog',
  yap: 'Prolog',
  spin: 'Propeller Spin',
  proto: 'Protocol Buffer',
  pub: 'Public Key',
  pd: 'Pure Data',
  pb: 'PureBasic',
  pbi: 'PureBasic',
  purs: 'PureScript',
  py: 'Python',
  bzl: 'Python',
  gyp: 'Python',
  lmi: 'Python',
  pyde: 'Python',
  pyp: 'Python',
  pyt: 'Python',
  pyw: 'Python',
  rpy: "Ren'Py",
  tac: 'Python',
  wsgi: 'Python',
  xpy: 'Python',
  pytb: 'Python traceback',
  qml: 'QML',
  qbs: 'QML',
  pri: 'QMake',
  r: 'Rebol',
  rd: 'R',
  rsx: 'R',
  raml: 'RAML',
  rdoc: 'RDoc',
  rbbas: 'REALbasic',
  rbfrm: 'REALbasic',
  rbmnu: 'REALbasic',
  rbres: 'REALbasic',
  rbtbar: 'REALbasic',
  rbuistate: 'REALbasic',
  rhtml: 'RHTML',
  rmd: 'RMarkdown',
  rkt: 'Racket',
  rktd: 'Racket',
  rktl: 'Racket',
  scrbl: 'Racket',
  rl: 'Ragel in Ruby Host',
  raw: 'Raw token data',
  reb: 'Rebol',
  r2: 'Rebol',
  r3: 'Rebol',
  rebol: 'Rebol',
  red: 'Red',
  reds: 'Red',
  cw: 'Redcode',
  rs: 'Rust',
  rsh: 'RenderScript',
  robot: 'RobotFramework',
  rg: 'Rouge',
  rb: 'Ruby',
  builder: 'Ruby',
  gemspec: 'Ruby',
  god: 'Ruby',
  irbrc: 'Ruby',
  jbuilder: 'Ruby',
  mspec: 'Ruby',
  pluginspec: 'XML',
  podspec: 'Ruby',
  rabl: 'Ruby',
  rake: 'Ruby',
  rbuild: 'Ruby',
  rbw: 'Ruby',
  rbx: 'Ruby',
  ru: 'Ruby',
  ruby: 'Ruby',
  thor: 'Ruby',
  watchr: 'Ruby',
  'rs.in': 'Rust',
  sas: 'SAS',
  scss: 'SCSS',
  smt2: 'SMT',
  smt: 'SMT',
  sparql: 'SPARQL',
  rq: 'SPARQL',
  sqf: 'SQF',
  hqf: 'SQF',
  cql: 'SQL',
  ddl: 'SQL',
  prc: 'SQL',
  tab: 'SQL',
  udf: 'SQL',
  viw: 'SQL',
  db2: 'SQLPL',
  ston: 'STON',
  svg: 'SVG',
  sage: 'Sage',
  sagews: 'Sage',
  sls: 'Scheme',
  sass: 'Sass',
  scala: 'Scala',
  sbt: 'Scala',
  sc: 'SuperCollider',
  scaml: 'Scaml',
  scm: 'Scheme',
  sld: 'Scheme',
  sps: 'Scheme',
  ss: 'Scheme',
  sci: 'Scilab',
  sce: 'Scilab',
  self: 'Self',
  sh: 'Shell',
  bash: 'Shell',
  bats: 'Shell',
  command: 'Shell',
  ksh: 'Shell',
  'sh.in': 'Shell',
  tmux: 'Shell',
  tool: 'Shell',
  zsh: 'Shell',
  'sh-session': 'ShellSession',
  shen: 'Shen',
  sl: 'Slash',
  slim: 'Slim',
  smali: 'Smali',
  tpl: 'Smarty',
  sp: 'SourcePawn',
  sma: 'SourcePawn',
  nut: 'Squirrel',
  stan: 'Stan',
  ML: 'Standard ML',
  fun: 'Standard ML',
  sig: 'Standard ML',
  sml: 'Standard ML',
  do: 'Stata',
  ado: 'Stata',
  doh: 'Stata',
  ihlp: 'Stata',
  mata: 'Stata',
  matah: 'Stata',
  sthlp: 'Stata',
  styl: 'Stylus',
  scd: 'SuperCollider',
  swift: 'Swift',
  sv: 'SystemVerilog',
  svh: 'SystemVerilog',
  vh: 'SystemVerilog',
  toml: 'TOML',
  txl: 'TXL',
  tcl: 'Tcl',
  adp: 'Tcl',
  tm: 'Tcl',
  tcsh: 'Tcsh',
  csh: 'Tcsh',
  tex: 'TeX',
  aux: 'TeX',
  bbx: 'TeX',
  bib: 'TeX',
  cbx: 'TeX',
  dtx: 'TeX',
  ins: 'TeX',
  lbx: 'TeX',
  ltx: 'TeX',
  mkii: 'TeX',
  mkiv: 'TeX',
  mkvi: 'TeX',
  sty: 'TeX',
  toc: 'TeX',
  tea: 'Tea',
  txt: 'Text',
  no: 'Text',
  textile: 'Textile',
  thrift: 'Thrift',
  tu: 'Turing',
  ttl: 'Turtle',
  twig: 'Twig',
  ts: 'typescript',
  tsx: 'typescriptreact',
  upc: 'Unified Parallel C',
  anim: 'Unity3D Asset',
  asset: 'Unity3D Asset',
  mat: 'Unity3D Asset',
  meta: 'Unity3D Asset',
  prefab: 'Unity3D Asset',
  unity: 'Unity3D Asset',
  uno: 'Uno',
  uc: 'UnrealScript',
  ur: 'UrWeb',
  urs: 'UrWeb',
  vcl: 'VCL',
  vhdl: 'VHDL',
  vhd: 'VHDL',
  vhf: 'VHDL',
  vhi: 'VHDL',
  vho: 'VHDL',
  vhs: 'VHDL',
  vht: 'VHDL',
  vhw: 'VHDL',
  vala: 'Vala',
  vapi: 'Vala',
  veo: 'Verilog',
  vim: 'VimL',
  vb: 'Visual Basic',
  bas: 'Visual Basic',
  frm: 'Visual Basic',
  frx: 'Visual Basic',
  vba: 'Visual Basic',
  vbhtml: 'Visual Basic',
  vbs: 'Visual Basic',
  volt: 'Volt',
  vue: 'Vue',
  owl: 'Web Ontology Language',
  webidl: 'WebIDL',
  x10: 'X10',
  xc: 'XC',
  xml: 'XML',
  ant: 'XML',
  axml: 'XML',
  ccxml: 'XML',
  clixml: 'XML',
  cproject: 'XML',
  csl: 'XML',
  csproj: 'XML',
  ct: 'XML',
  dita: 'XML',
  ditamap: 'XML',
  ditaval: 'XML',
  'dll.config': 'XML',
  dotsettings: 'XML',
  filters: 'XML',
  fsproj: 'XML',
  fxml: 'XML',
  glade: 'XML',
  grxml: 'XML',
  iml: 'XML',
  ivy: 'XML',
  jelly: 'XML',
  jsproj: 'XML',
  kml: 'XML',
  launch: 'XML',
  mdpolicy: 'XML',
  mxml: 'XML',
  nproj: 'XML',
  nuspec: 'XML',
  odd: 'XML',
  osm: 'XML',
  plist: 'XML',
  props: 'XML',
  ps1xml: 'XML',
  psc1: 'XML',
  pt: 'XML',
  rdf: 'XML',
  rss: 'XML',
  scxml: 'XML',
  srdf: 'XML',
  storyboard: 'XML',
  stTheme: 'XML',
  'sublime-snippet': 'XML',
  targets: 'XML',
  tmCommand: 'XML',
  tml: 'XML',
  tmLanguage: 'XML',
  tmPreferences: 'XML',
  tmSnippet: 'XML',
  tmTheme: 'XML',
  ui: 'XML',
  urdf: 'XML',
  ux: 'XML',
  vbproj: 'XML',
  vcxproj: 'XML',
  vssettings: 'XML',
  vxml: 'XML',
  wsdl: 'XML',
  wsf: 'XML',
  wxi: 'XML',
  wxl: 'XML',
  wxs: 'XML',
  x3d: 'XML',
  xacro: 'XML',
  xaml: 'XML',
  xib: 'XML',
  xlf: 'XML',
  xliff: 'XML',
  xmi: 'XML',
  'xml.dist': 'XML',
  xproj: 'XML',
  xsd: 'XML',
  xul: 'XML',
  zcml: 'XML',
  'xsp-config': 'XPages',
  'xsp.metadata': 'XPages',
  xpl: 'XProc',
  xproc: 'XProc',
  xquery: 'XQuery',
  xq: 'XQuery',
  xql: 'XQuery',
  xqm: 'XQuery',
  xqy: 'XQuery',
  xs: 'XS',
  xslt: 'XSLT',
  xsl: 'XSLT',
  // eslint-disable-next-line camelcase
  xojo_code: 'Xojo',
  // eslint-disable-next-line camelcase
  xojo_menu: 'Xojo',
  // eslint-disable-next-line camelcase
  xojo_report: 'Xojo',
  // eslint-disable-next-line camelcase
  xojo_script: 'Xojo',
  // eslint-disable-next-line camelcase
  xojo_toolbar: 'Xojo',
  // eslint-disable-next-line camelcase
  xojo_window: 'Xojo',
  xtend: 'Xtend',
  yml: 'YAML',
  reek: 'YAML',
  rviz: 'YAML',
  'sublime-syntax': 'YAML',
  syntax: 'YAML',
  yaml: 'YAML',
  'yaml-tmlanguage': 'YAML',
  yang: 'YANG',
  y: 'Yacc',
  yacc: 'Yacc',
  yy: 'Yacc',
  zep: 'Zephir',
  zimpl: 'Zimpl',
  zmpl: 'Zimpl',
  zpl: 'Zimpl',
  desktop: 'desktop',
  'desktop.in': 'desktop',
  ec: 'eC',
  eh: 'eC',
  edn: 'edn',
  fish: 'fish',
  mu: 'mupad',
  nc: 'nesC',
  ooc: 'ooc',
  rst: 'reStructuredText',
  rest: 'reStructuredText',
  'rest.txt': 'reStructuredText',
  'rst.txt': 'reStructuredText',
  wisp: 'wisp',
  prg: 'xBase',
  prw: 'xBase'
};

export const FileDetails = ({ fileName }: PropsWithChildren<FileDetailsProps>) => {
  const language = extensionToLanguage[path.extname(fileName).slice(1)]?.toUpperCase();
  return (
    <Flex gap={{ default: 'gapSm' }}>
      <Flex
        className="pf-chatbot__code-icon"
        justifyContent={{ default: 'justifyContentCenter' }}
        alignItems={{ default: 'alignItemsCenter' }}
        alignSelf={{ default: 'alignSelfCenter' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 4C0 1.79086 1.79086 0 4 0H20C22.2091 0 24 1.79086 24 4V20C24 22.2091 22.2091 24 20 24H4C1.79086 24 0 22.2091 0 20V4Z"
            fill="currentColor"
          />
          <g clipPath="url(#clip0_3280_27505)">
            <path
              d="M13.8204 5.63002C13.3954 5.50752 12.9529 5.75502 12.8304 6.18002L9.63035 17.38C9.50785 17.805 9.75535 18.2475 10.1804 18.37C10.6054 18.4925 11.0479 18.245 11.1704 17.82L14.3704 6.62002C14.4929 6.19502 14.2454 5.75252 13.8204 5.63002ZM15.8354 8.63252C15.5229 8.94502 15.5229 9.45252 15.8354 9.76502L18.0679 12L15.8329 14.235C15.5204 14.5475 15.5204 15.055 15.8329 15.3675C16.1454 15.68 16.6529 15.68 16.9654 15.3675L19.7654 12.5675C20.0779 12.255 20.0779 11.7475 19.7654 11.435L16.9654 8.63502C16.6529 8.32252 16.1454 8.32252 15.8329 8.63502L15.8354 8.63252ZM8.16785 8.63252C7.85535 8.32002 7.34785 8.32002 7.03535 8.63252L4.23535 11.4325C3.92285 11.745 3.92285 12.2525 4.23535 12.565L7.03535 15.365C7.34785 15.6775 7.85535 15.6775 8.16785 15.365C8.48035 15.0525 8.48035 14.545 8.16785 14.2325L5.93285 12L8.16785 9.76502C8.48035 9.45252 8.48035 8.94502 8.16785 8.63252Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath>
              <rect width="16" height="12.8" fill="white" transform="translate(4 5.60001)" />
            </clipPath>
          </defs>
        </svg>
      </Flex>
      <Stack>
        <StackItem>
          <span className="pf-chatbot__code-fileName">{path.parse(fileName).name}</span>
        </StackItem>
        {language && <StackItem className="pf-chatbot__code-language">{language}</StackItem>}
      </Stack>
    </Flex>
  );
};

export default FileDetails;