; --- Rialo Jumper Installer Script ---
[Setup]
AppName=Rialo Jumper
AppVersion=1.0
DefaultDirName={pf}\Rialo Jumper
DefaultGroupName=Rialo Jumper
OutputBaseFilename=RialoJumperSetup
DisableProgramGroupPage=yes
AllowNoIcons=yes
Compression=lzma
SolidCompression=yes

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Files]
Source: "C:\Users\admin\Desktop\RialoJumperRelease\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\Rialo Jumper"; Filename: "{app}\main.exe"
Name: "{userdesktop}\Rialo Jumper"; Filename: "{app}\main.exe"; WorkingDir: "{app}"
