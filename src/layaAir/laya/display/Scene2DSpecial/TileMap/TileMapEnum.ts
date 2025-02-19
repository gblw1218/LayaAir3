export enum TillMap_CellNeighbor {
    RIGHT_SIDE = 0,
    RIGHT_CORNER,
    BOTTOM_RIGHT_SIDE,
    BOTTOM_RIGHT_CORNER,
    BOTTOM_SIDE,
    BOTTOM_CORNER,
    BOTTOM_LEFT_SIDE,
    BOTTOM_LEFT_CORNER,
    LEFT_SIDE,
    LEFT_CORNER,
    TOP_LEFT_SIDE,
    TOP_LEFT_CORNER,
    TOP_SIDE,
    TOP_CORNER,
    TOP_RIGHT_SIDE,
    TOP_RIGHT_CORNER,
    MAX,
}

export enum TillMap_TerrainMode {
    MATCH_CORNERS_AND_SIDES = 0,
    MATCH_CORNERS,
    MATCH_SIDES,
}

export enum TileShape {
    TILE_SHAPE_SQUARE,//四边矩形
    TILE_SHAPE_ISOMETRIC,//菱形
    TILE_SHAPE_HALF_OFFSET_SQUARE,//错位quad
    TILE_SHAPE_HEXAGON,//六边形
}

export enum TileMap_CustomDataVariant{
    Number,
    Bool,
    String,
    Object,
}