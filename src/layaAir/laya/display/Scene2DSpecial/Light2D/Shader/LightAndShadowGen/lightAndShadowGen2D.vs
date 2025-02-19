#define SHADER_NAME LightAndShadowGen2D_VS
#include "Sprite2DVertex.glsl";

void main() {
	v_texcoord = a_uv;
	v_color = u_LightColor * u_LightIntensity;
	gl_Position = vec4((a_position.x / u_baseRenderSize2D.x - 0.5) * 2.0, (0.5 - a_position.y / u_baseRenderSize2D.y) * 2.0, 0.0, 1.0);
    #ifdef INVERT_Y_2D
        gl_Position.y = -gl_Position.y;
    #endif
}