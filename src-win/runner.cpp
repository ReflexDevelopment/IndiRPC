#include <windows.h>

LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    if (msg == WM_DESTROY) PostQuitMessage(0);
    return DefWindowProc(hwnd, msg, wParam, lParam);
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE, LPSTR, int) {
    WNDCLASSEX wc = {};
    wc.cbSize        = sizeof(WNDCLASSEX);
    wc.lpfnWndProc   = WndProc;
    wc.hInstance     = hInstance;
    wc.lpszClassName = "IndiRPCRunner";
    RegisterClassEx(&wc);

    // Message-only window: invisible, no taskbar entry, no tray, not in Alt+Tab
    CreateWindowEx(
        0, "IndiRPCRunner", "", 0,
        0, 0, 0, 0, HWND_MESSAGE, NULL, hInstance, NULL
    );

    MSG msg;
    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return 0;
}
