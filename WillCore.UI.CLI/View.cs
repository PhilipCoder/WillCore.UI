using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using WillCore.UI.CLI.Properties;

namespace WillCore.UI.CLI
{
    public static class View
    {
        public static void Create(string path)
        {
            var viewNameTag = "$safeitemname$";
            Console.WriteLine($"Creating view {path}...");
            var fileName = Path.GetFileNameWithoutExtension(path);
            var fileDirectory = $"{Path.GetDirectoryName(path)}\\{fileName}";

            if (!File.Exists($"{fileDirectory}.js"))
                File.WriteAllText($"{fileDirectory}.js", Resources.view_itemName_js.Replace(viewNameTag, fileName));

            if (!File.Exists($"{fileDirectory}.bindings.js"))
                File.WriteAllText($"{fileDirectory}.bindings.js", Resources.view_itemName_bindings_js.Replace(viewNameTag, fileName));

            if (!File.Exists($"{fileDirectory}.collections.js"))
                File.WriteAllText($"{fileDirectory}.collections.js", Resources.view_itemName_collections_js.Replace(viewNameTag, fileName));

            if (!File.Exists($"{fileDirectory}.sources.js"))
                File.WriteAllText($"{fileDirectory}.sources.js", Resources.view_itemName_collections_sources_js.Replace(viewNameTag, fileName));

            if (!File.Exists($"{fileDirectory}.targets.js"))
                File.WriteAllText($"{fileDirectory}.targets.js", Resources.view_itemName_collections_targets_js.Replace(viewNameTag, fileName));

            if (!File.Exists($"{fileDirectory}.traps.js"))
                File.WriteAllText($"{fileDirectory}.traps.js", Resources.view_itemName_collections_traps_js.Replace(viewNameTag, fileName));

            if (!File.Exists($"{fileDirectory}.events.js"))
                File.WriteAllText($"{fileDirectory}.events.js", Resources.view_itemName_events_js.Replace(viewNameTag, fileName));

            if (!File.Exists($"{fileDirectory}.logic.js"))
                File.WriteAllText($"{fileDirectory}.logic.js", Resources.view_itemName_logic_js.Replace(viewNameTag, fileName));

            if (!File.Exists($"{fileDirectory}.meta.js"))
                File.WriteAllText($"{fileDirectory}.meta.js", Resources.view_itemName_meta_js.Replace(viewNameTag, fileName));
        }

        public static void Delete(string path)
        {
            var viewNameTag = "$safeitemname$";
            Console.WriteLine($"Creating view {path}...");
            var fileName = Path.GetFileNameWithoutExtension(path);
            var fileDirectory = $"{Path.GetDirectoryName(path)}\\{fileName}";

            if (File.Exists($"{fileDirectory}.js"))
                File.Delete($"{fileDirectory}.js");

            if (File.Exists($"{fileDirectory}.bindings.js"))
                File.Delete($"{fileDirectory}.bindings.js");

            if (File.Exists($"{fileDirectory}.collections.js"))
                File.Delete($"{fileDirectory}.collections.js");

            if (File.Exists($"{fileDirectory}.sources.js"))
                File.Delete($"{fileDirectory}.sources.js");

            if (File.Exists($"{fileDirectory}.targets.js"))
                File.Delete($"{fileDirectory}.targets.js");

            if (File.Exists($"{fileDirectory}.traps.js"))
                File.Delete($"{fileDirectory}.traps.js");

            if (File.Exists($"{fileDirectory}.events.js"))
                File.Delete($"{fileDirectory}.events.js");

            if (File.Exists($"{fileDirectory}.logic.js"))
                File.Delete($"{fileDirectory}.logic.js");
        }

    }
}
