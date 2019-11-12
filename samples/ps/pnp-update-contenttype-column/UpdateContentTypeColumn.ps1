

function Update-CategoryOptionsInEventCT() {
    Write-Host "Start Update-CategoryOptions"
    $site = Get-PnPSite
    $web = $site.RootWeb
    $lang = Get-PnPProperty -Property Language -ClientObject $web
    
    # Providing different value based on lang. This is not necessary if you have only one lang for your env.
    # Here I am checking for Dutch lang sites as well
    if ($lang -eq 1043) {
        [array]$availableOptions = @("Actie",
            "Activiteit personeelsvereniging",
            "Extern",
            "Feestdag",
            "In-company training",
            "Jubileum"
        )
    }
    else {
        [array]$availableOptions = @("Action",
            "Staff association activity",
            "External",
            "Holiday",
            "In-company training",
            "Anniversary"
        )
    }


    $CTypes = Get-PnPContentType -InSiteHierarchy
    # You can also search by Content Type name, here I am getting all CT which uses Event CT as base
    $eventCTypes = $CTypes | Where-Object { $_.Id.ToString().StartsWith("0x0102") } 


    # Updating all content type which are Event CT type
    foreach ($contentType in $eventCTypes) {
        $contentTypeID = $contentType.Id.ToString()
        $eventCT_Name = $contentType.Name
        $columnInternalName = 'Category'
        $ctx = Get-PnPContext
        $ctx.Load($contentType.FieldLinks)
        $ctx.ExecuteQuery()
        $fieldInUse = $contentType.FieldLinks | Where { $_.Name -eq $columnInternalName }
        if ($null -ne $fieldInUse) {
            $fieldInUse = $fieldInUse.Id.ToString()
            $fullOption = $null
            foreach ($option in $availableOptions) {
                $fullOption += '<CHOICE>' + $option + '</CHOICE>'
            }
            if ($null -ne $fullOption) {
                $con = Get-Content -Path .\PnPProvision.xml
                # Dynamically updating xml. This is not necessary if your values are common for all the sites. 
                # In my case, it differs based on site lang
                $con | ForEach-Object {
                    $_ -replace 'dynamicCategoryID', $fieldInUse `
                        -replace 'availableChoice', $fullOption `
                } | Set-Content -Path .\PnPProvision.xml
                Apply-PnPProvisioningTemplate -Path PnPProvision.xml -Parameters @{"eventCT_ID" = $contentTypeID; "eventCT_Name" = $eventCT_Name; "categoryID" = $fieldInUse }
                $xmlContentOriginal | Set-Content -Path .\PnPProvision.xml
            }
        }
    }
    $xmlContentOriginal | Set-Content -Path .\PnPProvision.xml
    Disconnect-PnPOnline
    Write-Host "Finished Update-CategoryOptions"
}


try {
    $userName = 'ahamedfazil@fazildev.onmicrosoft.com'
    $pwd = Read-Host 'Please enter password for the user' $userName -AsSecureString
    $cred = New-Object -TypeName System.Management.Automation.PSCredential -argumentlist $userName, $pwd
    $xmlContentOriginal = Get-Content -Path .\PnPProvision.xml
    Connect-PnPOnline -Url "https://fazildev.sharepoint.com/sites/sppals/" -Credentials $cred
    Update-CategoryOptionsInEventCT
    Write-Host -ForegroundColor Green "Content type column property has been updated successfully"
}
catch {
    $xmlContentOriginal | Set-Content -Path .\PnPProvision.xml
    Write-Host -ForegroundColor Red "Exception occurred!"
    Write-Host -ForegroundColor Red "Exception Type: $($_.Exception.GetType().FullName)"
    Write-Host -ForegroundColor Red "Exception Message: $($_.Exception.Message)"
}
