// Two ASCII art banners for the site footer, one designed for wide viewports
// and a taller/narrower one for phones. FooterAsciiArt swaps between them via
// a matchMedia query and always transform-scales the chosen art to exactly
// fill the container width.

export type FooterRegion = "mountain" | "house" | "ground";

// Region palette. Adjust these hexes to retint each layer of the scene.
export const FOOTER_REGION_COLORS: Record<FooterRegion, string> = {
  mountain: "#1f1f1f",
  house: "#4a2c17",
  ground: "#1f3a1c",
};

export type FooterArtVariant = {
  lines: string[];
  columns: number;
  classify: (row: number, col: number) => FooterRegion;
};

function trimBlankEdges(value: string): string {
  const lines = value.split("\n");
  while (lines.length > 0 && lines[0].trim() === "") lines.shift();
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") lines.pop();
  return lines.join("\n");
}

function toVariant(
  raw: string,
  makeClassify: (dims: {
    rows: number;
    columns: number;
  }) => FooterArtVariant["classify"],
): FooterArtVariant {
  const text = trimBlankEdges(raw);
  const lines = text.split("\n");
  const columns = lines.reduce((max, line) => Math.max(max, line.length), 0);
  return { lines, columns, classify: makeClassify({ rows: lines.length, columns }) };
}

// -----------------------------------------------------------------------------
// Desktop / wide-viewport art. Mountain silhouette on the left, house cluster
// on the right, ground line spans the bottom.

const DESKTOP_RAW = String.raw`



                                  ......
                             .~77!~^^^^~!!!!!~:.
                          .!77:              .:~!!!~:
                      .^77~.                      :7PGJ?^.
                   :!YBP?!:..   ...           ^?7!^.    .^!77^.
               .~?7^.    .^^~!!!~~~!77!!!!!!7?!              :~77~.
            ^7?~.                                                .~7?~.
     ..^!777^.                                                       .~?7:
!!7!!~^:.                                                               .!J!.                                                                       ..............
                                                                           :??^                                                         .:^~!!!!!~~~~^^^^^^^^^^^^~~!!!!!~^^:.
                                                                              ~?!:                                               ..^~!7!~^..                             ..:~~!!!~~^:.
                                                                                .~?7~.                                     .:~!!7~^..                                             ..^!7!!~:.
                                                                                    :~77~:                          .:~!!!!^:.                                                           .:~!7~.
                                                                                        .^77~.                .^!!7!~:.                                                                       .^!7!:
                                                                                            .!77.       .^!!7!^.                                                                                  .^!?~.
                                                                                               .!?^.:!77~:                                                                                            .~
                                                                                               .:?P7^.
                                                                                           .^7?~:
                                                                                       .~7?~:
                                                                                    :!?!:
                                                                                 :7?^.
                                                                              :7?^
                                                                            ~J!.
                                                                         ^7?:                                                                                        ^!?7
                                                                     :!77^                                                                                       :^^J7^^&!:^^^^^?J.
                                                                .^!7!^.                                                                                          #:.JG.:#!.....B?:B
                                                          .^!!7!^:.                                                                                             .#   ^~!!     JJ  ~G
                                                         :^.                                                                                                    P!           ?Y    !P
                                                                                                                                                              ~Y^          .Y7      :P.
                                                                                                                                                           :7?^          .7Y.        .Y5.
                                                                                                                                                       .~77~.          .?J:           .7G:
                                                                                                                                                   .7!!~.           .^P5.       .     B  7J~
                                                                                                                                                  .!77!~^^:......777!.P!    ~7!7~G:   B.  :PP~.
                                                                                                                                                        .5~:^~~^~?.   J?    #.   5~   P5!!~^.:~
                                                                                                                            ~     .~      :     .^      .B :Y~~P7^~5. !Y    B.   JJ   ??
                                                                                                                           .@.    !&     ^&     ~&  ....!G :#:.#!..5? :B    B.   ~P   !Y
........                                                                                                                   .@?77??G@?JJJ?G@J?JJJ5@Y77!~~JB .#7JBPYJ5~  #    G.   :G   ^P
^^^^^^~~~~~~!!!!!!!!!!!!!!!!!!!!!!!!!~~~~~^^^^::::........:::^~~~~!!!!~~~~~~~~~~??^^^^:7J:::::!Y:::::^P~:::^^~7^^^^^^^^^~~~J#~^^~~JB!~~~^!Y^~~!77#?~7!~!?#7!?7~^::.....?..:.^:..:7G7?JPB7!!!!!~~~~~~~~~~
                                        .......:::^~^^^^^^::...                ...........:::::^::::::~:.:...............                           .......:..:::^^^~~~^~~!^:^^^^:....
`;

// Desktop region classification.
const DESKTOP_HOUSE_ROW_START = 22;
const DESKTOP_HOUSE_COL_START = 118;
const DESKTOP_GROUND_ROWS_FROM_BOTTOM = 2;

export const footerArtDesktop: FooterArtVariant = toVariant(
  DESKTOP_RAW,
  ({ rows }) => (row, col) => {
    const groundStart = rows - DESKTOP_GROUND_ROWS_FROM_BOTTOM;
    if (row >= groundStart) return "ground";
    if (row === groundStart - 1 && col < DESKTOP_HOUSE_COL_START) return "ground";
    if (row >= DESKTOP_HOUSE_ROW_START && col >= DESKTOP_HOUSE_COL_START) return "house";
    return "mountain";
  },
);

// -----------------------------------------------------------------------------
// Mobile / narrow-viewport art. Taller, denser scene rendered around ~100
// columns so it stays legible on phones.

const MOBILE_RAW = String.raw`







                                               ?J7!~^:.
                                               PGGGPPGP5~
                                               :P555PGGGG!     ...
                                                .J55GBBGP!  ~J55P5J.
                                                  !J5PP5! .5BGP5GGPY.
                                                     77..^J~. ..::::.
                                                     ::7Y^
                                        .^!7??7~:    .5!  ^!7??~.
                                     .75GGPPGGGGG5.  .! !5PGGGGGP?:
                                      .PBGP5GGPP5P5  ? !BGGGGGGPJ:
                                       .JGPGGGGGPP5 ^^:YYJJJ7!^.
                                         .:~7???J5Y~J:. .^~::^.
                                                  .JY .JPPPPPP^
                                             .~77^..J.?P5PPPYJJ??J?77??~
                                           :77??JPPPPPPPPP5YJJJJJJYJYJYY???7:
                                           ~7??J?J!~?555Y7^^JJJJJYYJYJJJYYYY:
                                           ::::^.   Y~..    :JJJJJJYYYYYYJ?7
                                                 ^7?J????7^  ~PP555J!!!!~.
                                                 !?7J5PPPPP!  ~J^?J!^:.
                                      .::!!^!7!. .!Y5PGP555J  ~:~PGGGGGG5!~.
                                   ~JJYYYYYYYYYJ7^.^7Y5J?J?: ..7BBBBBGGP7^:.
                                 ^JYJJJJYYYJJJJJJYJ?~  .755??7?YY??55Y^
                                 !YJJJJ5B##PYJJJJJJJ7 :J55YY5YJJY7
                                .JJJJYY5B#B5JJJJJJY5PPGPP555J?!^:
        .~!~!!!?J7              .JYJYYJJJYJJJJJY~?GBBBBBP5PPY
      :7JYYYJJJJJY?              .?JJJJJJJJJJYJ~~55PGGGGPPGG7  ~J5YYJ~
    ..?YJJYJJJJJYJ!  :!!           :?55YY5Y5!!. 7PGP555J7Y?J~ 5BBGPGBB7      :~:
  :YYYJJJJJYYJJY~ .?PGGG7        .!5BGGGGPYJ^ !.!YYJ5PPP7.^!:^7J55P5Y?~.    !J5Y?77?!.
  .JYYYYYY5PGGGG. 5BBBGGP        .^~!!!^.     ~5^^77JG##B~    .:^!Y?~:     ^P??JYYYYYYY?.
    .^7!~:^Y555^  PBBBBB!                ..:   5..7?J5GGY  ^YGGGGGGGPP5!~!^^?JYYYJJJJYYYY7:
            .JP5^ ^BBG5^  .:^.  .     ^J5PGBP?.7!:!!JYYY!.!GBBBBGPPPPPP5PGGPJJYYPBBBPYYJYYY.
      ^!7~. JBGGG5~Y^. ^5GBGPGPY. .~??YYYY555~ ^5Y7JJJJJ?!?YPBBBGP5PGGP555P5JJYJG&&#GYJJJYY?
    ^JYYYY5~?PPPP5J7  !B###BGPP5JJYYYYJJYJJJY:  !?.?JJJ?77YYY^.  ~YPGG55P5PPYJJJ5P55YYJJYY?.
    ~5YYY55YJ?JJYJ.^~ J###BBBPJJJJYYJYYJJJJJYJ. 7^ ^JY7JP5Y5P^      ^J.^?PPPPPP5JJJJ??JYY:
     .~~JJ7?JJJYJ5P!Y7.GGP5J!?JJJYY5GBBGYJJJJJ?7!!7..~75PPPPJ     .:7!^!~~?BBBGP55P5J~..
       .?J7!77?JJ!. .JJ^     !JJJYY5&&&#YJJJJJYJ7??7   .:?J~..^7!^::....   ^7JY55GBGGGY.
    :7Y5GPY7^:!JJ!::..5.    .JJJJJYYPBBPJJJJJJYYJ7~.     ?7^:.  ...^J55YYY?^   !5GBGGGG:
  ^PGGG5PG577PGPPPG5~^7Y.  .YB5JJYYYJJJJJJJJJYYY!     .!!:          ^5YY555PY.   .:::.:
 .77???!~:.7GBBGPY^    .?: YBBBPYYJJJYYYYYYJ5PGGPJ!^.7?.             J5Y55YYP^
            .:^~!7?Y5Y?: 7!.!YPPGPPP57!!~PPGBBBBBGBJ^~                !??JY5!
              ~YGBBBBBBBJ:7!    ~5GGBG7 .BBBBBBBBPPJ7^  !YJ?Y5J^:^:       .:
            .?PGGGBBGJ~:...7?^7J?JJ?~?B.!YJY55JJJ7!!JG5:555PPGGG57:
               ..:..      .JB###BGGP5^^5.     .^~~^:~PG^:!^^::..
                          .JGBBBGBBGGP.?. ^?~^^^^~^^^!7?!.    .^!?JP:
                      .^!?J???7??5?:..^7J.57.      J?  7~  :JPGGBBGB:
                    .?BBGG##GY^. ~!~.   ^Y.        ^B5~?  ^GGGGGGGGG.
                   .PGGBBP?^.       :~~^:5~         ?BB.  YGPPPGGGY:
                   !GGGPJ.             .:!JJ7^.      PBY  7BBGPY7:
                   JG57.            :~7!~~^:.^7J?^   .PGJ ^G!.
                  ..              7PGGGPPPPPY7:.7YPY: ^BB??:
                                .PBGPGGGGPPPG7     !5Y:7BB7
                                5BBGPPGGGPPP^        !G5GGG!
                               :!7Y555PP5Y!.          .JGGGG~      .~?JJ?!:
                                     ..                 ~GGGG.    ?GBBBBBBGP7
                                                         ^GGB7   5BGGGGGGBGP5:
                                                          5GGY  :B?^...~JPGGGP7
                                                          PGG5 :J.       YGGGP?
                                                         .GBGP!:         .55?^
                                                         YBGB7             .
                                                        !BGGG.
`;

// Mobile art is a mixed scene without clear region rectangles -- render every
// non-space char in the mountain color for now. Retune here later if
// individual buildings/trees should get their own hues.
export const footerArtMobile: FooterArtVariant = toVariant(
  MOBILE_RAW,
  () => () => "mountain",
);
