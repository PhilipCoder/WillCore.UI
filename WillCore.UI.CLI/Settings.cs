using System;
using System.Collections.Generic;
using System.Text;

namespace WillCore.UI.CLI
{
    public static class Settings
    {
        public static readonly string WillCoreJSUrl = "https://github.com/PhilipCoder/WillCore.UI/raw/master/WillCore.UI/Dist/willCore.zip";
        public static readonly string BootstrapURL = "https://github.com/twbs/bootstrap/releases/download/v4.3.1/bootstrap-4.3.1-dist.zip";
        public static string SolutionDirectory { get; set; }
        public static string WorkingDirectory { get; set; }
    }
}
